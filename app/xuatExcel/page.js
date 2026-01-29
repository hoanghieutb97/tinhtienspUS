'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { getItemsByQuery, fetchPhuKien, fetchVatLieu, get_ShipingCost, tongTienLop } from "@/lib/utils";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { saveAs } from 'file-saver';
import copy from 'copy-to-clipboard';
export default function UploadPage() {
  const [jsonData, setJsonData] = useState([]);
  const [error, setError] = useState(null);
  const [activeItems, setactiveItems] = useState([]);
  const [phuKien, setPhuKien] = useState([]);
  const [vatLieu, setVatLieu] = useState([]);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [ShippingCost, setShippingCost] = useState([]);
  const [query, setQuery] = useState("");
  const [activeKey, setactiveKey] = useState(0);
  const [falseMatchEx, setfalseMatchEx] = useState([]);
  const [xuatItems, setxuatItems] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        setError('File không hợp lệ. Vui lòng chọn file .xls hoặc .xlsx.');
        return;
      }
      setError(null);

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          setJsonData(json);
        } catch (err) {
          setError('Lỗi khi xử lý file. Vui lòng thử lại.');
          console.error('Error parsing file:', err);
        }
      };

      reader.readAsArrayBuffer(file);
    },
  });

  useEffect(() => {
    fetchSanPham();
    async function getitems() {
      let items = await get_ShipingCost();
      setShippingCost(items)
    }
    getitems();
  }, []);

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
    console.log(items);

    setQuery("")
    setLoading(false); // Bắt đầu trạng thái loading

  }

  if (jsonData.length > 0 && activeItems.length > 0) {
    let itemsAPP = [...jsonData]
    let arrLoc = [];
    let trueItemsApp = []
    let falseItemsApp = []


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let itemsFiller = [];
    let trueItemsEx = []
    let falseItemsEx = []
    for (let i = 0; i < jsonData.length; i++) {
      itemsFiller = activeItems.filter(item => {
        return item.thongSoTong.product.trim().toLowerCase() == jsonData[i].ProductName.trim().toLowerCase()
      })
      let canMatchT = false;
      let itemsMatch = {};
      for (let k = 0; k < itemsFiller.length; k++) {

        if (isMatch(jsonData[i].Variant.trim().toLowerCase(), itemsFiller[k].thongSoTong.variant.trim().toLowerCase())) {
          canMatchT = true;
          trueItemsEx.push(jsonData[i]);
          itemsMatch = itemsFiller[k];
          break;
        }

      }
      if (canMatchT == false) falseItemsEx.push(jsonData[i])
      if (Object.keys(itemsMatch).length > 0) {


        let TongTienSX = tongTienLop(itemsMatch.lop, vatLieu, itemsMatch.thongSoTong, phuKien);
        let Rate = 26000;

        itemsAPP[i].tongTienSX = (TongTienSX / (Rate)).toFixed(2);
        itemsAPP[i].chiPhi_GiaBan = (TongTienSX * 100 / (Rate * itemsMatch.thongSoTong.vipChot[3])).toFixed(2);
        itemsAPP[i].tongLoiNhuan = ((itemsMatch.thongSoTong.vipChot[3]) - TongTienSX / Rate).toFixed(2);
        itemsAPP[i].phanTramLoiNhuan = (((itemsMatch.thongSoTong.vipChot[3]) - TongTienSX / Rate) * 100 / itemsMatch.thongSoTong.vipChot[3]).toFixed(2);
        itemsAPP[i].giaBanFullFill = ((TongTienSX / (Rate)) + (0.4 * ((itemsMatch.thongSoTong.vipChot[3]) - TongTienSX / Rate))).toFixed(2)
      }
      else {
        itemsAPP[i].tongTienSX = 0
        itemsAPP[i].chiPhi_GiaBan = 0
        itemsAPP[i].tongLoiNhuan = 0
        itemsAPP[i].phanTramLoiNhuan = 0
        itemsAPP[i].giaBanFullFill = 0
      }

    }

    if (itemsAPP.length !== xuatItems.length) setxuatItems(itemsAPP);



    if (falseMatchEx.length !== falseItemsEx.length) setfalseMatchEx(falseItemsEx);

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
  const exportToExcel = (jsonData) => {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // Xuất file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "products.xlsx");
  };
  return (
    <>
      <div className="p-6 flex flex-col items-center gap-4">
        <div {...getRootProps()} className="border-dashed border-2 p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
          <input {...getInputProps()} />
          <p className="text-gray-600">Kéo & thả file Excel vào đây hoặc nhấp để chọn file</p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <button onClick={() => exportToExcel(jsonData)} >click xuat</button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Variant</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {falseMatchEx.map((item, index) => (
              <TableRow key={index} hover className={index == activeKey ? "activekety" : ""}>
                <TableCell onClick={() => hangClickItem(item.ProductName, index)}>{item.ProductName}</TableCell>
                <TableCell onClick={() => hangClickItem(item.Variant, index)}>{item.Variant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button onClick={() => exportToExcel(falseMatchEx)} >click xuat file chua them APP</button>
    </>
  );
}
