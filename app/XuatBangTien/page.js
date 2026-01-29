'use client';

import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { getItemsByQuery, tongTienLop, tinhTienTK, tinhTienIn, tinhTienCat, tinhTienDongGoi } from "@/lib/utils";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import copy from 'copy-to-clipboard';
import { fetchPhuKien, fetchVatLieu } from "@/lib/utils";
import { saveAs } from 'file-saver';

export default function UploadPage() {
  const [jsonData, setJsonData] = useState([]);
  const [activeItems, setactiveItems] = useState([]);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [query, setQuery] = useState("");
  const [activeKey, setactiveKey] = useState(0);

  const [phuKien, setPhuKien] = useState([]);
  const [vatLieu, setVatLieu] = useState([]);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx")) {
      setError("File không hợp lệ. Vui lòng chọn file .xls hoặc .xlsx.");
      return;
    }

    setError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(json); // Xử lý dữ liệu ở đây
        setJsonData(json);
      } catch (err) {
        setError("Lỗi khi xử lý file. Vui lòng thử lại.");
        console.error("Error parsing file:", err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    fetchSanPham();
  }, []);
  console.log(activeItems);

  var fetchSanPham = async () => {
    setLoading(true); // Bắt đầu trạng thái loading
    await getItemsAll("sanpham");
    let ItemsPK = await fetchPhuKien();
    let ItemsVL = await fetchVatLieu();

    setPhuKien(ItemsPK);
    setVatLieu(ItemsVL);
    setLoading(false); // Bắt đầu trạng thái loading

  }
  async function getItemsAll(param) {
    setLoading(true); // Bắt đầu trạng thái loading
    let items = await getItemsByQuery("/" + param, "");
    setactiveItems(items);


    setQuery("")
    setLoading(false); // Bắt đầu trạng thái loading

  }



  var items_False_Variant = [] // items khớp variant với nhau
  var listN = [];

  if (jsonData.length > 0 && activeItems.length > 0) {
    for (let i = 0; i < jsonData.length; i++) {

      let arrLoc = [];
      arrLoc = activeItems.filter(item => {
        return item.thongSoTong.product.trim().toLowerCase() == jsonData[i].ProductName.trim().toLowerCase()
      })
      var khop = false;

      for (let k = 0; k < arrLoc.length; k++) {


        if (isMatch(jsonData[i].Variant.trim().toLowerCase(), arrLoc[k].thongSoTong.variant.trim().toLowerCase())) {

          khop = true;
          let TongTienSX = tongTienLop(arrLoc[k].lop, vatLieu, arrLoc[k].thongSoTong, phuKien);
          let Rate = 26000;

          let luongcongnhan = vatLieu.filter(itemxx => itemxx.nameCode == "luongcongnhan")[0];

          listN.push({
            ...jsonData[i],
            vip1: arrLoc[k].thongSoTong.vipChot[0],
            vip2: arrLoc[k].thongSoTong.vipChot[1],
            vip3: arrLoc[k].thongSoTong.vipChot[2],
            vip4: arrLoc[k].thongSoTong.vipChot[3],
            vip5: arrLoc[k].thongSoTong.vipChot[4],
            vip6: arrLoc[k].thongSoTong.vipChot[5],
            tienBaseCost: (TongTienSX / Rate).toFixed(2),
            chiPhi_GiaBan: (TongTienSX * 100 / (Rate * arrLoc[k].thongSoTong.vipChot[3])).toFixed(2),
            tongLoiNhuan: ((arrLoc[k].thongSoTong.vipChot[3]) - TongTienSX / Rate).toFixed(2),
            phanTramLoiNhuan: (((arrLoc[k].thongSoTong.vipChot[3]) - TongTienSX / Rate) * 100 / arrLoc[k].thongSoTong.vipChot[3]).toFixed(2),
            giaBanFullFill: ((TongTienSX / (Rate)) + (0.4 * ((arrLoc[k].thongSoTong.vipChot[3]) - TongTienSX / Rate))).toFixed(2),
            chieuNgan: arrLoc[k].thongSoTong.chieuNgang,
            chieuDai: arrLoc[k].thongSoTong.chieuDoc,
            doCao: arrLoc[k].thongSoTong.doCao,
            tongCan: arrLoc[k].thongSoTong.canNang,
            tinhTienTK: tinhTienTK(arrLoc[k].lop, vatLieu) * 26 * 8 * 60 / luongcongnhan.price,
            tinhTienIn: tinhTienIn(arrLoc[k].lop, vatLieu) * 26 * 8 * 60 / luongcongnhan.price,
            tinhTienCat: tinhTienCat(arrLoc[k].lop, vatLieu) * 26 * 8 * 60 / luongcongnhan.price,
            tinhTienDongGoi: tinhTienDongGoi(arrLoc[k].lop, vatLieu) * 26 * 8 * 60 / luongcongnhan.price,

          });


          break;
        }
      }
      if (!khop) {
        listN.push({ ...jsonData[i], tienBaseCost: 0 });
        items_False_Variant.push(jsonData[i])
      }
    }


  }

  const exportToExcel = (jsonData) => {

    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Xuất file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "gia products.xlsx");
  };


  function exportToExcelAll(params) {

    var listAllX = activeItems.map(item => {


      let Rate = 26000;
      let TongTienSX = tongTienLop(item.lop, vatLieu, item.thongSoTong, phuKien);
      if (item.thongSoTong.vipChot == undefined) item.thongSoTong.vipChot = [0, 0, 0, 0, 0]
      let luongcongnhan = vatLieu.filter(itemxx => itemxx.nameCode == "luongcongnhan")[0];


      return {
        ProductName: item.thongSoTong.product,
        Variant: item.thongSoTong.variant,
        vip1: item.thongSoTong.vipChot[0],
        vip2: item.thongSoTong.vipChot[1],
        vip3: item.thongSoTong.vipChot[2],
        vip4: item.thongSoTong.vipChot[3],
        vip5: item.thongSoTong.vipChot[4],
        vip6: item.thongSoTong.vipChot[5],
        tienBaseCost: (TongTienSX / Rate).toFixed(2),
        chiPhi_GiaBan: (TongTienSX * 100 / (Rate * item.thongSoTong.vipChot[3])).toFixed(2),
        tongLoiNhuan: ((item.thongSoTong.vipChot[3]) - TongTienSX / Rate).toFixed(2),
        phanTramLoiNhuan: (((item.thongSoTong.vipChot[3]) - TongTienSX / Rate) * 100 / item.thongSoTong.vipChot[3]).toFixed(2),
        giaBanFullFill: ((TongTienSX / (Rate)) + (0.4 * ((item.thongSoTong.vipChot[3]) - TongTienSX / Rate))).toFixed(2),
        chieuNgan: item.thongSoTong.chieuNgang,
        chieuDai: item.thongSoTong.chieuDoc,
        doCao: item.thongSoTong.doCao,
        tongCan: item.thongSoTong.canNang,
        tinhTienTK: tinhTienTK(item.lop, vatLieu) * 26 * 8 * 60 / luongcongnhan.price,
        tinhTienIn: tinhTienIn(item.lop, vatLieu) * 26 * 8 * 60 / luongcongnhan.price,
        tinhTienCat: tinhTienCat(item.lop, vatLieu) * 26 * 8 * 60 / luongcongnhan.price,
        tinhTienDongGoi: tinhTienDongGoi(item.lop, vatLieu) * 26 * 8 * 60 / luongcongnhan.price,
      }
    });
    exportToExcel(listAllX)


  }
  function isMatch(Ap, Ex) {
    // Chuyển đổi dấu * trong B thành một phần regex phù hợp
    let pattern = Ex.replace(/\*/g, ".*");

    // Tạo biểu thức chính quy với pattern đã thay đổi
    let regex = new RegExp(`^${pattern}$`, "i");

    return regex.test(Ap);
  }

  function hangClickItem(params, index) {
    copy(params);
    setactiveKey(index);
  }
  if (loading) return <></>
  return (
    <>


      <div className="p-6 flex flex-col items-center gap-4">
        {/* Ẩn input file, dùng button trigger */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".xls,.xlsx"
          className="hidden"
          onChange={handleFileSelect}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
        >
          Nhấn để chọn file Excel
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </div>


      <h4 className="khongtrungvp">không khớp variant: <span className="gsjdgnsduv">{items_False_Variant.length}</span> </h4>
      <TableContainer component={Paper} className='sdjnsdksdjvnsdk'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Variant</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items_False_Variant.map((item, index) => (
              <TableRow key={index} hover className={index == activeKey ? "activekety" : ""}>
                <TableCell onClick={() => hangClickItem(item.ProductName, index)}>{item.ProductName}</TableCell>
                <TableCell onClick={() => hangClickItem(item.Variant, index)}>{item.Variant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="col-12">
        <button onClick={() => exportToExcel(listN)} type="button" className="btn btn-primary btn-lg btn-block w-100">Tải xuống bảng</button>
      </div>

      <div className="col-12 mt-5">
        <button onClick={() => exportToExcelAll()} type="button" className="btn btn-danger btn-lg btn-block w-100">Tải xuống Tổng</button>
      </div>

    </>
  );
}
