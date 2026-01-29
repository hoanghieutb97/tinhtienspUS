'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import ThemSanPham from './themSamPham';
import { Box, Modal, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { functions } from 'lodash';
import { usePhukien } from "../context/PhukienContext";
import AddIcon from '@mui/icons-material/Add';
import { putSanPham } from "@/lib/utils";

function ShowVariant(props) {
    const { getItemsByQuery } = usePhukien();

    let listItems = props.activeProduct.data;
    const [handleAddSP, sethandleAddSP] = useState(false);
    const [activeSuaSP, setactiveSuaSP] = useState([]);
    const [addNewStatus, setaddNewStatus] = useState(false);
    const [styleSP, setstyleSP] = useState("new");
    const [inputValue, setInputValue] = useState("");


    function dongCTN(params) {
        sethandleAddSP(false);
        setaddNewStatus(false);

    }
    function handleSuaSP(item) {
        setstyleSP("old");
        sethandleAddSP(true);
        setactiveSuaSP(item)
    }
    function themSPMoi(params) {
        setstyleSP("new");
        let item = { ...listItems[0] };
        for (let i = 0; i < item.lop.length; i++) {
            item.lop[i].chieuDai = "";
            item.lop[i].chieuRong = "";

        }
        item.thongSoTong.variant = "";
        setactiveSuaSP(item)
        setaddNewStatus(false);
        sethandleAddSP(true);




    }

    async function themThue() {
        props.setLoading(true);
        for (let i = 0; i < listItems.length; i++) {
            let DataPost = {
                thongSoTong: { ...listItems[i].thongSoTong, phanTramThue: inputValue },
                lop: listItems[i].lop,
                name: listItems[i].name,
                namecode: listItems[i].namecode
            }
            let xxx = await putSanPham(listItems[i]._id, DataPost);


            await new Promise(resolve => setTimeout(resolve, 100));
        }

        props.getItemsAll("sanpham");

    }
    async function handleDeleteItem(item) {
        props.setLoading(true)
        const response = await fetch(`/api/sanpham?id=${item._id}`, {
            method: 'DELETE',
            credentials: "include",
        });
        let result = await response.json();

        props.getItemsAll("sanpham");
        // props.setLoading(false)

    }
    async function addDuplicate(item) {
        const res = await fetch('/api/sanpham/duplicate', {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item._id })
        });

        const data = await res.json();
        if (data.success) {

            console.log("Nhân đôi thành công, ID mới:", data.newId);
        } else {
            console.error("Lỗi:", data.error);
        }
        props.getItemsAll("sanpham");
    }
    async function chuyen(id) {


    }
    console.log(listItems);

    return (

        <>
            {handleAddSP && <ThemSanPham dongCTN={dongCTN} data={activeSuaSP} typeCPN={!addNewStatus ? "editProduct" : ""} styleSP={styleSP} phuKien={props.phuKien} vatLieu={props.vatLieu} setLoading={props.setLoading} getItemsAll={props.getItemsAll} Rate={props.Rate} ShippingCost={props.ShippingCost} />}


            {!handleAddSP && <div className="clickshowprd">
                <Button variant="contained" color="success" onClick={themSPMoi}>
                    Thêm Sản Phẩm variant
                </Button>

                <div className="col-12">
                    <input
                        type="number"
                        placeholder="Nhập số"
                        className="form-control"
                        style={{ marginBottom: '10px' }}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button variant="contained" color="success" onClick={themThue} >
                        thêm thuế
                    </Button>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                {listItems.map((item, key) => <div className="col-2 motproduct11" key={key} >
                                    <div className="divtongsp">
                                        <IconButton aria-label="delete" className='iconbtdlele' onClick={() => handleDeleteItem(item)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete" className='iconbtdleleadd' onClick={() => addDuplicate(item)}>
                                            <AddIcon />
                                        </IconButton>
                                        <div className="tenpk">product: <span className="hhhg"> {item.thongSoTong.product}</span></div>
                                        <div className="tenpk">variant:<span className="hhhg">{item.thongSoTong.variant} </span> </div>
                                        <div className="tenpk">note:<span className="hhhg"> {item.thongSoTong.note}</span> </div>
                                        <div className="divanh">
                                            <Image priority src={item.thongSoTong.anh} alt="My GIF" width={500} height={300} className="anhpksp" />
                                        </div>
                                        <div className="ctnbtnsp">
                                            <button className="btn btn-primary bthgg" onClick={() => handleSuaSP(item)}> Sửa sản phẩm </button>
                                        </div>


                                    </div>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>




            </div>}

        </>
    );
}

export default ShowVariant;