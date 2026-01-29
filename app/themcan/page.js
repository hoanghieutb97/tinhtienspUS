'use client';

import { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { getItemsByQuery, fetchPhuKien, fetchVatLieu, get_ShipingCost, putSanPham } from "@/lib/utils";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import copy from 'copy-to-clipboard';
export default function UploadPage() {
  const [jsonData, setJsonData] = useState([]);
  // const [error, setError] = useState(null);
  const [activeItems, setactiveItems] = useState([]);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [query, setQuery] = useState("");
  const [activeKey, setactiveKey] = useState(0);

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

  const [ItemSuaVip, setItemSuaVip] = useState([]);
  const [ItemSuaVariant, setItemSuaVariant] = useState([]);
  useEffect(() => {
    fetchSanPham();
  }, []);

  var fetchSanPham = async () => {
    setLoading(true); // Bắt đầu trạng thái loading
    await getItemsAll("sanpham");
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
  console.log(ItemSuaVip);
  console.log(activeItems);

  if (jsonData.length > 0 && activeItems.length > 0) {
    let itemsAPP = [...activeItems]
    let arrLoc = [];
    let items_Map_Vip = [] // items khớp nhưng không trùng vip

    let items_Map_Variant = [] // items khớp variant
    let items_Map_Variant_ = [] // items khớp variant
    let items_False_Variant = [] // items khớp variant

    for (let i = 0; i < activeItems.length; i++) {
      arrLoc = jsonData.filter(item => {
        if (item.ProductName == undefined) console.log(item);

        return activeItems[i].thongSoTong.product.trim().toLowerCase() == item.ProductName.trim().toLowerCase()
      })
      let canMatch = false;

      for (let k = 0; k < arrLoc.length; k++) {

        if (isMatch(arrLoc[k].Variant.trim().toLowerCase(), activeItems[i].thongSoTong.variant.trim().toLowerCase())) {
          canMatch = true;
          let itemABC = { ...activeItems[i] };
          items_Map_Variant.push({ ...activeItems[i] })

          if (!((itemABC.thongSoTong.chieuDoc == arrLoc[k].doc && itemABC.thongSoTong.chieuNgang == arrLoc[k].ngang) && itemABC.thongSoTong.doCao == arrLoc[k].cao)) {
            // console.log("vdssssssssssssssssaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            itemABC.thongSoTong.chieuDoc = + arrLoc[k].doc;
            itemABC.thongSoTong.chieuNgang = + arrLoc[k].ngang;
            itemABC.thongSoTong.doCao = + arrLoc[k].cao;
            itemABC.thongSoTong.canHop = + arrLoc[k].canhop;
            itemABC.thongSoTong.canVl = + arrLoc[k].canvl;
            itemABC.thongSoTong.canNang = + arrLoc[k].canhop + arrLoc[k].canvl;
            itemABC.thongSoTong.canChangeTST = false;
            itemABC.thongSoTong.type = "publish";

            items_Map_Vip.push({ ...itemABC });
            // console.log("items_Map_Vip!!!!!!!!!!!!!!!!!!!!!!!!", items_Map_Vip);
          }
          break;

        }

      }
      if (canMatch == false) items_False_Variant.push(activeItems[i])
     
      // console.log("*****************************************************************************", items_Map_Vip);

    }
    // for (let xxx = 0; xxx < items_False_Variant.length; xxx++) {
        
    //   items_False_Variant[xxx].thongSoTong.canChangeTST = true;
    //   items_False_Variant[xxx].thongSoTong.canVl = 0;
    //   items_False_Variant[xxx].thongSoTong.canHop = 0;

    // }
    // console.log("items_Map_Vip!!!!!!!!!!!!!!!!!!!!!!!!", items_Map_Vip);
    // if (items_False_Variant.length != ItemSuaVariant.length) setItemSuaVariant(items_False_Variant);
    if (items_Map_Vip.length != ItemSuaVip.length) setItemSuaVip(items_Map_Vip);





  }
  async function suaVIpApp() {
    console.log(ItemSuaVip);
    // console.log(ItemSuaVariant);

    // for (let i = 0; i < ItemSuaVip.length; i++) {
    //   let DataPost = {
    //     thongSoTong: ItemSuaVip[i].thongSoTong,
    //     lop: ItemSuaVip[i].lop,
    //     name: ItemSuaVip[i].name,
    //     namecode: ItemSuaVip[i].namecode
    //   }
    //   let xxx = await putSanPham(ItemSuaVip[i]._id, DataPost);
    //   // console.log(DataPost);


    // }


    // for (let i = 0; i < ItemSuaVariant.length; i++) {
    //   let DataPost = {
    //     thongSoTong: ItemSuaVariant[i].thongSoTong,
    //     lop: ItemSuaVariant[i].lop,
    //     name: ItemSuaVariant[i].name,
    //     namecode: ItemSuaVariant[i].namecode
    //   }
    //   let xxx = await putSanPham(ItemSuaVariant[i]._id, DataPost);
    //   // console.log(DataPost);


    // }

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
  // console.log(ItemSuaVip);
  // console.log(ItemSuaVariant);

  return (
    <>
      {/* <div className="p-6 flex flex-col items-center gap-4">
        <div {...getRootProps()} className="border-dashed border-2 p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
          <input {...getInputProps()} />
          <p className="text-gray-600">Kéo & thả file Excel vào đây hoặc nhấp để chọn file</p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div> */}

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


      <h4 className="khongtrungvp">khớp variant- sai VIP {ItemSuaVip.length}</h4>
      <TableContainer component={Paper} className='sdjnsdksdjvnsdk'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Variant</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ItemSuaVip.map((item, index) => (
              <TableRow key={index} hover className={index == activeKey ? "activekety" : ""}>
                <TableCell onClick={() => hangClickItem(item.thongSoTong.product, index)}>{item.thongSoTong.product}</TableCell>
                <TableCell onClick={() => hangClickItem(item.thongSoTong.variant, index)}>{item.thongSoTong.variant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button onClick={suaVIpApp}> sửa VIP trên app </button>

      <hr />
      <hr />
      <hr />
      <h4 className="khongtrungvp">sai Variant trên app tính tiền  {ItemSuaVariant.length}</h4>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Variant</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ItemSuaVariant.map((item, index) => (
              <TableRow key={index} hover className={index == activeKey ? "activekety" : ""}>
                <TableCell onClick={() => hangClickItem(item.thongSoTong.product, index)}>{item.thongSoTong.product}</TableCell>
                <TableCell onClick={() => hangClickItem(item.thongSoTong.variant, index)}>{item.thongSoTong.variant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
