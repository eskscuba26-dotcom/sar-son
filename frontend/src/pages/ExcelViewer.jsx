import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileSpreadsheet, AlertCircle } from "lucide-react";
import api from "@/services/api";

export const ExcelViewer = () => {
  const [excelData, setExcelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExcelData();
  }, []);

  const loadExcelData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/excel-viewer");
      setExcelData(response.data);
      setError(null);
    } catch (err) {
      setError("Excel dosyası yüklenirken hata oluştu: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-400">SAR-2025 dosyası yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!excelData || !excelData.sheets || excelData.sheets.length === 0) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>Excel dosyası boş veya okunamadı.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-blue-500" />
            <div>
              <CardTitle className="text-2xl text-white">
                {excelData.filename}
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                {excelData.sheets.length} sayfa bulundu
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              {excelData.sheets.map((sheet, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {sheet.name}
                  <span className="ml-2 text-xs opacity-70">
                    ({sheet.data.length} satır)
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {excelData.sheets.map((sheet, sheetIndex) => (
              <TabsContent key={sheetIndex} value={sheetIndex.toString()} className="mt-6">
                <div className="rounded-lg border border-slate-700 bg-slate-950/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-900/30 hover:bg-blue-900/40 border-slate-700">
                          <TableHead className="text-blue-300 font-bold w-12 text-center sticky left-0 bg-blue-900/30">
                            #
                          </TableHead>
                          {sheet.columns.map((column, colIndex) => (
                            <TableHead
                              key={colIndex}
                              className="text-blue-300 font-semibold whitespace-nowrap min-w-[120px]"
                            >
                              {column}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sheet.data.map((row, rowIndex) => {
                          // Bozuk veri kontrolü (0 ile başlayan veya anormal satırlar)
                          const isBrokenRow = row[0] === 0 || row[0] === "0";
                          
                          return (
                            <TableRow
                              key={rowIndex}
                              className={`border-slate-800 hover:bg-slate-800/50 ${
                                isBrokenRow ? "bg-red-900/20 border-red-800" : ""
                              }`}
                            >
                              <TableCell className="text-slate-500 text-center font-mono text-xs sticky left-0 bg-slate-900/90">
                                {rowIndex + 1}
                              </TableCell>
                              {row.map((cell, cellIndex) => {
                                // Boş hücre kontrolü
                                const isEmpty = cell === null || cell === undefined || cell === "";
                                
                                return (
                                  <TableCell
                                    key={cellIndex}
                                    className={`text-slate-300 ${
                                      isEmpty ? "bg-yellow-900/20 text-yellow-600" : ""
                                    } ${isBrokenRow ? "text-red-400" : ""}`}
                                  >
                                    {isEmpty ? (
                                      <span className="italic text-yellow-600/60">boş</span>
                                    ) : (
                                      String(cell)
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* İstatistikler */}
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Toplam Satır:</span>
                      <span className="ml-2 text-white font-semibold">{sheet.data.length}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Toplam Sütun:</span>
                      <span className="ml-2 text-white font-semibold">{sheet.columns.length}</span>
                    </div>
                    <div>
                      <span className="text-red-400">⚠️ Bozuk Satır:</span>
                      <span className="ml-2 text-red-300 font-semibold">
                        {sheet.data.filter(row => row[0] === 0 || row[0] === "0").length}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Uyarı Kartı */}
      <Alert className="bg-orange-900/20 border-orange-800">
        <AlertCircle className="h-4 w-4 text-orange-500" />
        <AlertDescription className="text-orange-200">
          <strong>Dikkat:</strong> Sarı arka planlı hücreler <strong>BOŞ</strong>, 
          kırmızı arka planlı satırlar <strong>BOZUK VERİ</strong> içeriyor!
        </AlertDescription>
      </Alert>
    </div>
  );
};
