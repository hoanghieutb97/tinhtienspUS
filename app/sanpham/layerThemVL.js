'use client';

import { useState, useEffect } from 'react';
import SelectChatLieuLop from "./selectChatLieuLop";
import Image from "next/image";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from 'lodash';
import { Box, Modal, Typography, IconButton } from '@mui/material';


import CloseIcon from '@mui/icons-material/Close';
export default function LayerThemVL(props) {

    const vatLieu = props.vatLieu;


    const [isCustomOpen, setIsCustomOpen] = useState(false);
    function xoaLayer() {
        props.xoaLayer(props.stt)
    }
    function changeThongtinLop(name, value) {
        if (name == "chatLieu" && value == "custom") {
            // khong lam gi ca vi co ham xu ly rieng roi
        }
        else {
            if (value == "true") value = true;
            if (value == "false") value = false;
            let item = props.item;
            item[name] = value
            props.changeLopCL(item, props.stt);
            if (name == "chieuDai") {
                props.handleChangeThongSoTong("chieuDai", value)
            }
            if (name == "chieuRong") {
                props.handleChangeThongSoTong("chieuRong", value)
            }
        }
    }
    function setChatLieuNgoai(item) {
        let name = item._id;


        if (name != undefined)
            changeThongtinLop("chatLieu", "custom" + name)
        setIsCustomOpen(false);
    }
    let custom_chatLieu = vatLieu.filter(item => item._id == props.item.chatLieu.replace(/^custom/, ""));
    function handleChonValLieu(params) {
        setIsCustomOpen(true); // Mở cửa sổ component tùy chỉnh

    }

    return (
        <>
            <div className='ggg'>
                <div className="svsvdsvss">
                    <div>{/* vật liệu */}
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-simple-select-standard-label">Chất Liệu</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                onChange={(e) => changeThongtinLop("chatLieu", e.target.value)} value={((props.item.chatLieu?.startsWith("custom")) ? "custom" : props.item.chatLieu)}
                                label="Chất Liệu"
                            >
                                <MenuItem value="mica2mm">Mica 2mm</MenuItem>
                                <MenuItem value="mica3mm">Mica 3mm</MenuItem>
                                <MenuItem value="mica4mm">Mica 4mm</MenuItem>
                                <MenuItem value="mica5mm">Mica 5mm</MenuItem>
                                <MenuItem value="mica15mm">Mica 15mm</MenuItem>
                                <MenuItem value="go2mm">Gỗ 2mm</MenuItem>
                                <MenuItem value="go3mm">Gỗ 3mm</MenuItem>
                                <MenuItem value="go5mm">Gỗ 5mm</MenuItem>
                                <MenuItem value="go6mm">Gỗ 6mm</MenuItem>
                                <MenuItem value="mica3mmhologram">Mica 3mm Hologram</MenuItem>
                                <MenuItem value="micagonsong3mm">Mica 3mm gơn sóng</MenuItem>
                                <MenuItem value="custom" onClick={handleChonValLieu}>Phôi sẵn</MenuItem>
                            </Select>

                        </FormControl>
                        <Modal
                            open={isCustomOpen}
                            onClose={setChatLieuNgoai}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '94vw',
                                    height: '90vh',
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    p: 4,
                                    overflow: 'auto', position: 'relative', // Để định vị button trong modal
                                    background: "#dfdfdf"
                                }}
                            >

                                <IconButton
                                    onClick={setChatLieuNgoai}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        zIndex: 99,
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <SelectChatLieuLop onClose={setChatLieuNgoai} vatLieu={vatLieu} />
                            </Box>
                        </Modal>
                        {/* {isCustomOpen && <SelectChatLieuLop onClose={setChatLieuNgoai} />} */}


                    </div>

                    {/* Chiều dài */}
                    <div className="kvsvlsvlffs">
                        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                            <TextField id="outlined-basic" label="Chiều ngang" variant="outlined" type="number" size="small"
                                value={props.item.chieuDai || ''}
                                onChange={(e) => changeThongtinLop("chieuDai", _.toNumber(e.target.value))}
                                placeholder="Nhập số"
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">inch</InputAdornment>, }, }}
                            />
                        </Box>
                    </div>

                    {/* chiều rộng */}
                    <div className="kvsvlsvlffs">
                        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                            <TextField id="outlined-basic" label="Chiều dọc" variant="outlined" type="number" size="small"
                                value={props.item.chieuRong || ''}
                                onChange={(e) => changeThongtinLop("chieuRong", _.toNumber(e.target.value))}
                                placeholder="Nhập số"
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">inch</InputAdornment>, }, }}
                            />
                        </Box>
                    </div>





                    {/* số mặt */}
                    <div>{/* vật liệu */}
                        <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                            <InputLabel id="demo-simple-select-standard-label">Số mặt in</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                onChange={(e) => changeThongtinLop("soMatIn", e.target.value)}
                                value={props.item.soMatIn}
                                label="Số  mặt in"
                            >
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value={false}>không in</MenuItem>

                            </Select>
                        </FormControl>
                    </div>




                    {/* có cắt không */}
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                            <InputLabel id="demo-simple-select-standard-label">Cut Laze</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={props.item.catStatus}
                                onChange={(e) => changeThongtinLop("catStatus", e.target.value)}
                                label="Cut Laze"
                            >
                                <MenuItem value={true}>có</MenuItem>
                                <MenuItem value={false}>không</MenuItem>
                            </Select>
                        </FormControl>
                    </div>





                    {/* có khắc không */}
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                            <InputLabel id="demo-simple-select-standard-label">Khắc</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={props.item.khacStatus}
                                onChange={(e) => changeThongtinLop("khacStatus", e.target.value)}
                                label="Khắc"
                            >
                                <MenuItem value={true}>có</MenuItem>
                                <MenuItem value={false}>không</MenuItem>
                            </Select>
                        </FormControl>
                    </div>


                    <Button onClick={xoaLayer} variant="outlined" startIcon={<DeleteIcon />}>
                        Xóa
                    </Button>
                </div>
                <div className="svsvdsvvvvvss">
                    {(custom_chatLieu.length != 0) && <><Image priority src={custom_chatLieu[0].imageUrl} alt="My GIF" width={500} height={300} className="anhpkvs" />  <span className="vvs">{custom_chatLieu[0].name}</span></>}

                </div>

            </div>

        </>



    );
}
