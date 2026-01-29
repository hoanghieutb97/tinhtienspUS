'use client';

import { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { getItemsByQuery, fetchPhuKien, fetchVatLieu, get_ShipingCost, putSanPham } from "@/lib/utils";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import copy from 'copy-to-clipboard';
export default function UploadPage() {

  const [activeItems, setactiveItems] = useState([]);
  useEffect(() => {
    fetchSanPham();
  }, []);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  var fetchSanPham = async () => {
    setLoading(true); // Bắt đầu trạng thái loading
    await getItemsAll("sanpham");
    setLoading(false); // Bắt đầu trạng thái loading

  }
  async function getItemsAll(param) {
    setLoading(true); // Bắt đầu trạng thái loading
    let items = await getItemsByQuery("/" + param, "");
    setactiveItems(items);
    setQuery("")
    setLoading(false); // Bắt đầu trạng thái loading

  }
  async function suaVIpApp() {


    for (let i = 0; i < activeItems.length; i++) {
      let DataPost = {
        thongSoTong: { ...activeItems[i].thongSoTong, phanTramThue: 0 },
        lop: activeItems[i].lop,
        name: activeItems[i].name,
        namecode: activeItems[i].namecode
      }
      let xxx = await putSanPham(activeItems[i]._id, DataPost);

      if (i == (activeItems.length - 1)) alert(" đã sửa xong !!!!")

      // Dừng lại 100ms trước khi tiếp tục vòng lặp tiếp theo
      await new Promise(resolve => setTimeout(resolve, 100));
    }

  }
  console.log(activeItems);

  return (
    <>
      <button onClick={suaVIpApp}>Sửa</button>
    </>
  );
}
