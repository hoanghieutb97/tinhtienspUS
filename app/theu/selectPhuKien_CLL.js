'use client';
import React from 'react';
import { useState, useEffect } from 'react';

import Image from "next/image";
import { Typography, IconButton, TextField, Box, Button } from "@mui/material";
const Fuse = require('fuse.js');

export default function SelectPhuKien_CLL(props) {
    let onClose = props.onClose;
    let phuKien = props.phuKien;
    
console.log(props);

    const [customValue, setCustomValue] = useState("");
    const [activeCL, setactiveCL] = useState(false);
    const [activeItem, setactiveItem] = useState(false);
    const [textSearch, settextSearch] = useState("");
    const handleSave = () => {

        closePopUp(activeItem._id)
    };
    function SelectChatLieuLop(item, key) {
        setactiveCL(key);
        setactiveItem(item);


    }
    function closePopUp(activeItem) {
        onClose([activeItem]); // Đóng cửa sổ sau khi lưu
        setactiveCL(false);
        setactiveItem(false);

    }

    const options = {
        keys: ['name'], // Trường cần tìm kiếm
        threshold: 0.3 // Mức độ chính xác (0 là chính xác hoàn toàn, 1 là chấp nhận sai lệch lớn)
    };

    const fuse = new Fuse(phuKien, options);
    // const searchResult = fuse.search(textSearch);
    const searchResult = textSearch ? fuse.search(textSearch).map(result => result.item) : phuKien; // Nếu textSearch rỗng, trả về toàn bộ mảng
    console.log(searchResult);


    return (
        <div className='yyb'>
            <div className='tytytyty'>



                <div className='bthtyth'>
                    <div className="row fvvsdvds">
                        <p className='title pk'>Danh sách phụ kiện</p>
                        <div className="col-6">
                            <Button variant="contained" onClick={handleSave} fullWidth > Lưu</Button>
                        </div>
                        <div className="col-6">
                            <Box className='vsvsdve'
                                component="form"

                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    value={textSearch}
                                    onChange={(e) => settextSearch(e.target.value)}
                                    id="outlined-basic"
                                    label="Tìm Kiếm..."
                                    variant="outlined"
                                    fullWidth />

                            </Box>
                        </div>
                    </div>
                </div>


                <div className="container">
                    <div className="row">
                        {
                            searchResult.map((item, key) =>
                                <div className={"pkhh col-3 motproduct11 " + ((key === activeCL) ? "activeCL" : "")} key={key} onClick={() => SelectChatLieuLop(item, key)} >
                                    <div className="ctnbtnrrrr">
                                        <div className="tenpk">Tên: <span className="hhhg">{item.name}</span></div>
                                        <div className="tenpk">  Giá tiền: <span className="hhhg">{item.price}</span></div>
                                        <div className="tenpk">Ghi chú: <span className="hhhg">{item.note}</span></div>
                                        {item.imageUrl ? <Image priority src={item.imageUrl} alt="My GIF" width={500} height={300} className="anhpk" /> : <></>}
                                    </div>
                                </div>)
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

