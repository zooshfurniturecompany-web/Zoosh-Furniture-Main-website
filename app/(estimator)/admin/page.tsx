"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Upload, 
  Trash2, 
  FileSpreadsheet, 
  FileText, 
  Settings, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Search,
  Plus
} from "lucide-react";
import Script from "next/script";
import Button from "@/components/ui/button";
import { db, DbProduct } from "@/lib/db";
import { importCatalogProducts, parseExcelCatalog } from "@/app/actions/catalog";

// Standard formatting for currency
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val);
};

export default function AdminPanelPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Database catalog state
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState("");

  // Upload/Parse state
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; msg?: string } | null>(null);

  // Settings State (loaded from localStorage or defaults)
  const [woodMultipliers, setWoodMultipliers] = useState<Record<string, number>>({
    "Plywood": 0.8,
    "Karivaka": 1.1,
    "Mahogany": 1.2,
    "Ash Wood": 1.3,
    "Teak": 1.5
  });

  const [featureCosts, setFeatureCosts] = useState<Record<string, number>>({
    "Cane Work": 3500,
    "Upholstery": 6000,
    "Drawer": 2000,
    "Door/Shutter": 2500,
    "Spindle Work": 3000,
    "Curved Design": 4500,
    "Marble Top": 10000,
    "Tray Extension": 2000
  });

  // Load products and settings on mount
  useEffect(() => {
    fetchProducts();

    // Load custom settings if any
    const savedWood = localStorage.getItem("zoosh_settings_wood");
    const savedFeatures = localStorage.getItem("zoosh_settings_features");
    if (savedWood) setWoodMultipliers(JSON.parse(savedWood));
    if (savedFeatures) setFeatureCosts(JSON.parse(savedFeatures));
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await db.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSettingsSave = () => {
    localStorage.setItem("zoosh_settings_wood", JSON.stringify(woodMultipliers));
    localStorage.setItem("zoosh_settings_features", JSON.stringify(featureCosts));
    alert("Pricing configuration saved successfully!");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this reference product?")) return;
    try {
      await db.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete product reference");
    }
  };

  // Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setParsedItems([]);
      setImportStatus(null);
    }
  };

  // Parse Excel Catalog via server action
  const handleParseExcel = async (selectedFile: File) => {
    setParsing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target?.result as string;
        const res = await parseExcelCatalog(base64);
        if (res.success && res.products) {
          setParsedItems(res.products);
          setImportStatus({ msg: `Successfully parsed ${res.products.length} products. Review details below and click Import.` });
        } else {
          setImportStatus({ success: false, msg: res.error || "Excel parsing failed." });
        }
      } catch (err) {
        setImportStatus({ success: false, msg: "Failed to parse file." });
      } finally {
        setParsing(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  // Parse PDF Catalog using browser PDF.js
  const handleParsePDF = async (selectedFile: File) => {
    setParsing(true);
    setImportStatus({ msg: "Loading browser PDF extraction engine..." });

    try {
      // Check if PDF.js library is loaded
      if (typeof window === "undefined" || !(window as any).pdfjsLib) {
        throw new Error("PDF parser library not loaded. Please wait a second and retry.");
      }

      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = "";
      setImportStatus({ msg: `Extracting text streams from ${pdf.numPages} pages...` });

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // Join words with spaces
        const pageText = textContent.items.map((item: any) => item.str).join("\n");
        fullText += `\n--- Page ${i} ---\n` + pageText;
      }

      // Start custom regex parsing matching ZOOSH internal catalogues
      setImportStatus({ msg: "Scanning catalog products & extracting price parameters..." });
      
      const extracted: any[] = [];
      const lines = fullText.split("\n");

      // Heuristic Scanner:
      // Loop through lines looking for codes like BD001, DN001, CST001, STD001, CTD001, BRS001, CH001
      for (let idx = 0; idx < lines.length; idx++) {
        const line = lines[idx].trim();
        const codeMatch = line.match(/\b(BD\d{3}|DN\d{3}|CST\d{3}|STD\d{3}|CTD\d{3}|BRS\d{3}|CH\d{3})\b/i);
        
        if (codeMatch) {
          const product_code = codeMatch[1].toUpperCase();
          
          // Look for adjacent price and descriptive lines
          let price = 15000;
          let name = "";
          let wood_type = "Teak";
          let dimensions = "Std";
          let featuresList: string[] = [];

          // Scan next 8 lines for details
          const searchRange = Math.min(idx + 8, lines.length);
          for (let j = idx; j < searchRange; j++) {
            const contextLine = lines[j].trim();
            if (!contextLine) continue;

            // Extract price (e.g. 41,500 or ₹33,600)
            const priceMatch = contextLine.match(/(?:₹|\b)\s*(\d{1,3}(?:,\d{3})+|\d{4,6})\b/);
            if (priceMatch && price === 15000) {
              price = parseFloat(priceMatch[1].replace(/,/g, ""));
            }

            // Extract wood
            const woodMatch = contextLine.match(/(Teak|Mahogany|Mahagony|Ash\s*Wood|Ashwood|Karivaka|Plywood)/i);
            if (woodMatch) {
              const wt = woodMatch[1].toLowerCase();
              if (wt.includes("teak")) wood_type = "Teak";
              else if (wt.includes("mahogany") || wt.includes("mahagony")) wood_type = "Mahogany";
              else if (wt.includes("ash")) wood_type = "Ash Wood";
              else if (wt.includes("karivaka")) wood_type = "Karivaka";
              else if (wt.includes("plywood")) wood_type = "Plywood";
            }

            // Extract name (usually lines with "Bed Cot", "Table", "Sofa", "Chair")
            if (
              (contextLine.toLowerCase().includes("cot") ||
               contextLine.toLowerCase().includes("table") ||
               contextLine.toLowerCase().includes("sofa") ||
               contextLine.toLowerCase().includes("chair") ||
               contextLine.toLowerCase().includes("stool") ||
               contextLine.toLowerCase().includes("teapoy")) &&
              !contextLine.toLowerCase().includes("collection") &&
              !contextLine.toLowerCase().includes("reference") &&
              name === ""
            ) {
              name = contextLine;
            }

            // Extract dimensions (e.g. 6x6.25 feet or 210*105*75 cm)
            if (contextLine.includes("feet") || contextLine.includes("cm") || contextLine.match(/\d+\s*\*+\s*\d+/)) {
              dimensions = contextLine;
            }

            // Extract features
            if (contextLine.toLowerCase().includes("cane")) featuresList.push("Cane Work");
            if (contextLine.toLowerCase().includes("upholste")) featuresList.push("Upholstery");
            if (contextLine.toLowerCase().includes("drawer")) featuresList.push("Drawer");
            if (contextLine.toLowerCase().includes("door") || contextLine.toLowerCase().includes("shutter")) featuresList.push("Door/Shutter");
            if (contextLine.toLowerCase().includes("spindle")) featuresList.push("Spindle Work");
            if (contextLine.toLowerCase().includes("curve")) featuresList.push("Curved Design");
            if (contextLine.toLowerCase().includes("marble")) featuresList.push("Marble Top");
            if (contextLine.toLowerCase().includes("tray")) featuresList.push("Tray Extension");
          }

          // Deduplicate features
          featuresList = Array.from(new Set(featuresList));

          // Set default names if not detected
          if (!name) {
            if (product_code.startsWith("BD")) name = "ZOOSH Bed Cot";
            else if (product_code.startsWith("DN")) name = "ZOOSH Dining Table";
            else if (product_code.startsWith("CST")) name = "ZOOSH Console Table";
            else if (product_code.startsWith("STD")) name = "ZOOSH Side Table";
            else if (product_code.startsWith("CTD")) name = "ZOOSH Centre Table";
            else if (product_code.startsWith("BRS")) name = "ZOOSH Bar Stool";
            else name = "ZOOSH Furniture Item";
          }

          // Determine Category based on code
          let category = "Chair";
          if (product_code.startsWith("BD")) category = "Bed Cot";
          else if (product_code.startsWith("DN")) category = "Dining Table";
          else if (product_code.startsWith("CST")) category = "Console Table";
          else if (product_code.startsWith("STD")) category = "Side Table";
          else if (product_code.startsWith("CTD")) category = "Centre Table";
          else if (product_code.startsWith("BRS")) category = "Bar Stool";
          else if (product_code.startsWith("CH")) {
            category = name.toLowerCase().includes("lounge") ? "Lounge Chair" : name.toLowerCase().includes("dining") ? "Dining Chair" : "Chair";
          }

          // Avoid duplicate codes in single parse run
          if (!extracted.some(p => p.product_code === product_code)) {
            extracted.push({
              product_code,
              name,
              category,
              wood_type,
              price,
              features: featuresList,
              dimensions
            });
          }
        }
      }

      if (extracted.length === 0) {
        // Simple mock parse fallback to make it testable for user PDFs
        throw new Error("No matching product codes found. Ensure the PDF conforms to the ZOOSH catalogue style.");
      }

      setParsedItems(extracted);
      setImportStatus({ msg: `Successfully parsed ${extracted.length} products. Review details below and click Import.` });

    } catch (err: any) {
      setImportStatus({ success: false, msg: err.message || "Failed to parse PDF." });
    } finally {
      setParsing(false);
    }
  };

  const handleUploadClick = () => {
    if (!file) return;

    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      handleParseExcel(file);
    } else if (file.name.endsWith(".pdf")) {
      handleParsePDF(file);
    } else {
      setImportStatus({ success: false, msg: "Unsupported format. Please upload a PDF or Excel catalogue." });
    }
  };

  // Import parsed items to Database
  const handleImportSubmit = async () => {
    if (parsedItems.length === 0) return;
    
    setParsing(true);
    setImportStatus({ msg: `Saving ${parsedItems.length} products to database...` });

    try {
      const res = await importCatalogProducts(parsedItems);
      if (res.success) {
        setImportStatus({ success: true, msg: `Import complete! Successfully saved ${res.insertedCount} products to the catalogue.` });
        setParsedItems([]);
        setFile(null);
        fetchProducts(); // refresh catalog list
      } else {
        setImportStatus({ success: false, msg: res.error || "Failed to import products." });
      }
    } catch (err) {
      setImportStatus({ success: false, msg: "Server action failed." });
    } finally {
      setParsing(false);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter(p => {
    const s = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(s) || 
           p.product_code.toLowerCase().includes(s) ||
           p.category.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-10">
      {/* Script tag to load PDF.js */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js" 
        strategy="afterInteractive"
      />

      {/* Page Header */}
      <div className="border-b border-neutral-800 pb-6">
        <h1 className="text-2xl font-bold tracking-wider uppercase">Administrative Panel</h1>
        <p className="text-sm text-neutral-400 mt-1">Configure business settings, pricing multipliers, and upload catalog files.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Catalogue Import & Settings */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Catalogue Upload Container */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">Upload Reference Catalogue</h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950 rounded-lg p-6 text-center cursor-pointer transition-colors space-y-2"
            >
              <Upload className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400 font-semibold">
                {file ? file.name : "Select Catalogue PDF or Excel"}
              </p>
              <p className="text-[10px] text-neutral-500">Supports PDF, XLSX, XLS</p>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept=".pdf,.xlsx,.xls"
              className="hidden" 
            />

            {file && (
              <div className="flex gap-2">
                <Button
                  onClick={handleUploadClick}
                  disabled={parsing}
                  className="flex-1 py-2 text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  {parsing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Scan File"}
                </Button>
                <button
                  onClick={() => { setFile(null); setParsedItems([]); setImportStatus(null); }}
                  className="px-3 py-2 border border-neutral-800 hover:bg-neutral-950 text-neutral-400 hover:text-white rounded-md text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Parsing/Import status logger */}
            {importStatus && (
              <div className={`p-4 rounded-md text-xs border ${
                importStatus.success === true 
                  ? "bg-green-500/10 border-green-500/20 text-green-400" 
                  : importStatus.success === false
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-neutral-950 border-neutral-850 text-neutral-300"
              }`}>
                {importStatus.msg}
              </div>
            )}

            {parsedItems.length > 0 && (
              <Button
                onClick={handleImportSubmit}
                disabled={parsing}
                className="w-full py-3 bg-white text-black hover:bg-neutral-200 transition-all font-bold text-xs flex items-center justify-center gap-1.5"
              >
                Import {parsedItems.length} Products
              </Button>
            )}
          </div>

          {/* Pricing settings */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">Pricing Engine Multipliers</h2>
            
            {/* Wood type multipliers */}
            <div className="space-y-3">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Wood Materials</span>
              <div className="space-y-2 text-xs">
                {Object.entries(woodMultipliers).map(([wood, val]) => (
                  <div key={wood} className="flex justify-between items-center gap-2">
                    <span className="text-neutral-400">{wood}</span>
                    <input
                      type="number"
                      value={val}
                      step={0.1}
                      onChange={(e) => setWoodMultipliers({ ...woodMultipliers, [wood]: parseFloat(e.target.value) })}
                      className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 w-20 text-right text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Flat feature costs */}
            <div className="space-y-3 pt-4 border-t border-neutral-850">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Feature Flat Costs (INR)</span>
              <div className="space-y-2 text-xs">
                {Object.entries(featureCosts).map(([feat, val]) => (
                  <div key={feat} className="flex justify-between items-center gap-2">
                    <span className="text-neutral-400">{feat}</span>
                    <input
                      type="number"
                      value={val}
                      step={500}
                      onChange={(e) => setFeatureCosts({ ...featureCosts, [feat]: parseInt(e.target.value) })}
                      className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 w-24 text-right text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSettingsSave}
              className="w-full py-2.5 bg-neutral-950 border border-neutral-800 text-white hover:bg-neutral-800 text-xs font-bold transition-all"
            >
              Save Configuration
            </Button>
          </div>

        </div>

        {/* Right Column: Database Products List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">Catalog References ({products.length})</h2>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search catalog products..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            {loadingProducts ? (
              <div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-xs">Loading catalogue products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <p className="text-xs">No reference products found.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-850 max-h-[600px] overflow-y-auto">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-neutral-800/10 transition-colors text-xs">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neutral-950 border border-neutral-800 rounded overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={p.image_url || "/images/products/chair1.jpg"} 
                          alt={p.name} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          {p.name}
                          <span className="px-1.5 py-0.5 rounded-full bg-neutral-950 border border-neutral-850 text-[9px] text-neutral-500 font-normal uppercase">
                            {p.product_code}
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1 flex gap-2">
                          <span>{p.category}</span>
                          <span>•</span>
                          <span>{p.wood_type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-white">
                        {formatCurrency(p.price)}
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-neutral-600 hover:text-red-500 transition-colors"
                        title="Delete Reference"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
