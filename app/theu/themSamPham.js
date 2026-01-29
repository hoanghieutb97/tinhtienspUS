'use client';
import { useState, useEffect } from 'react';
import LayerThemVL from './layerThemVL';
import { caculator_ShipingCost, tongTienLop, tinhCanNang, tinhCanNangUocLuong, cal_Status, tinhTienVL, createChatLark, URL_upload_cloudinary, initialWHZ, tagUserType, postSanPham, putSanPham } from '@/lib/utils';
import { Box, InputLabel, MenuItem, FormControl, Select, TextField, InputAdornment, Button, Typography, IconButton, FormControlLabel, FormGroup, Switch, Modal } from '@mui/material';
import { Send as SendIcon, PhotoCamera, Add, Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Image from 'next/image';
import SelectPhuKien_CLL from './selectPhuKien_CLL';

export default function ThemSanPham(props) {
    let typeCPN = props.typeCPN;
    let ItemSua = { ...props.data };
    let styleSP = props.styleSP;
    let Rate = props.Rate;
    let ShippingCost = props.ShippingCost;
    const STATUS_ADMIN = cal_Status(localStorage.getItem("userStatus"))
    const [CanNang_UocLuong, setCanNang_UocLuong] = useState(0);
    const defaultThongSoTong = {
        doCao: 2.5,
        chieuNgang: 0,
        chieuDoc: 0,
        xop: "xop5mm",
        anh: "",
        product: "",
        variant: "",
        note: "",
        type: "demo",
        canNang: 0,
        canHop: 0,
        canVl: 0,
        phuKien: [],
        vipaTuan: [0, 0, 0, 0, 0],
        vipChot: [0, 0, 0, 0, 0, 0],
        vipSale: [[0, 0, 0, 0, 0]],
        noteVipSale: [""],
        canChageTST: true,
        idChat: "",
        dateCreate: Date.now(),
        typeSanPham: "theu"
    }
    const vatLieu = props.vatLieu;
    const phuKien = props.phuKien;


    const [lop, setlop] = useState((typeCPN != "editProduct") ? [] : ItemSua.lop);
    const [isOpenSelectPK, setisOpenSelectPK] = useState(false);

    const [thongSoTong, setThongSoTong] = useState((typeCPN != "editProduct") ? defaultThongSoTong : { ...defaultThongSoTong, ...ItemSua.thongSoTong });

    const [image, setImage] = useState(null);

    const tienVL = tinhTienVL(lop, vatLieu, thongSoTong, phuKien)

    function CloseSelectPK(item) {

        setisOpenSelectPK(false);
        handleChangeThongSoTong("phuKien", [...thongSoTong.phuKien, ...item])

    }

    const handleChonAnh = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setThongSoTong({ ...thongSoTong, anh: base64String }); // Cần định nghĩa setBase64Image trước
            };
            reader.readAsDataURL(file); // Đọc file dưới dạng Data URL (Base64)
        }
        else {
            setImage(null);
            setThongSoTong({ ...thongSoTong, anh: "" }); // Cần định nghĩa setBase64Image trước
        }
    };

    function checkNewMessenger(DataPost) {

        if (DataPost.thongSoTong.idChat == "") return true
        return false

    }


    const HandlethemSanPham = async () => {
        let DataPost = {
            thongSoTong: thongSoTong,
            lop: lop,
            typeSanPham: "theu",
            name: thongSoTong.product,
            namecode: thongSoTong.product.normalize("NFD") // Chuyển các ký tự có dấu thành dạng kết hợp (e.g., 'Hiếu' -> 'Hiếu')
                .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu kết hợp
                .replace(/[^a-zA-Z]/g, "") // Giữ lại các ký tự a-z, A-Z
                .toLowerCase(),
        }

        props.setLoading(true);

        if (styleSP == "new") {
            if (image == null && DataPost.thongSoTong.anh == "") { alert("thiếu ảnh..."); props.setLoading(false); return false }
            let imageUrl
            try {

                // kiểm tra xem up ảnh chưa, chưa up thì up
                if (!DataPost.thongSoTong.anh.startsWith("https")) {
                    imageUrl = await URL_upload_cloudinary(thongSoTong.anh);
                    if (!imageUrl) {
                        alert("lỗi up ảnh");
                        return false;
                    }
                    DataPost.thongSoTong.anh = imageUrl;
                }

                // nếu chưa tạo tin nhắn, thì giờ tạo
                if (checkNewMessenger(DataPost)) {
                    let ID_Messenger = await createChatLark((imageUrl) ? imageUrl : DataPost.thongSoTong.anh, DataPost.thongSoTong.type, thongSoTong.product);
                    DataPost.thongSoTong.idChat = ID_Messenger;
                } else {
                    const StatusTagUserType = await tagUserType(DataPost.thongSoTong);
                }

                let statusPostSanPham = await postSanPham(DataPost);



            } catch (error) {
                console.error("Error:", error);
                alert("Không thể thêm phụ kiện!");
            } finally {

            }
        }
        else if (styleSP == "old") {
            if (DataPost.namecode !== ItemSua.namecode) {
                // đổi product và 
            }
            if (DataPost.thongSoTong.variant !== ItemSua.thongSoTong.variant) {
                // đổi product và 
            }
            if (DataPost.thongSoTong.type !== ItemSua.thongSoTong.type) {
                const StatusTagUserType = await tagUserType(DataPost.thongSoTong);
            }

            let statusPutSanPham = await putSanPham(ItemSua._id, DataPost)

        }


        props.getItemsAll("sanpham");
        // props.setLoading(false)
    };


    useEffect(() => {

        if (lop.length > 0) {


            if (thongSoTong.canChageTST) {
                setCanNang_UocLuong(Math.floor(tinhCanNangUocLuong(lop, vatLieu, thongSoTong, phuKien)))
                if ((+thongSoTong.canVl + thongSoTong.canHop) > 0) setThongSoTong({ ...thongSoTong, canNang: Math.floor(tinhCanNang(lop, vatLieu, thongSoTong, phuKien)) })
            }
        }

    }, [lop, thongSoTong.xop, thongSoTong.doCao, thongSoTong.chieuDoc, thongSoTong.canHop, thongSoTong.canVl, thongSoTong.chieuNgang, thongSoTong.phuKien.length]);


    async function suaThue() {
        props.setLoading(true);
        let DataPost = {
            thongSoTong: { ...thongSoTong, phanTramThue: thueInput },
            lop: lop,
            name: thongSoTong.product,
            namecode: thongSoTong.product.normalize("NFD") // Chuyển các ký tự có dấu thành dạng kết hợp (e.g., 'Hiếu' -> 'Hiếu')
                .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu kết hợp
                .replace(/[^a-zA-Z]/g, "") // Giữ lại các ký tự a-z, A-Z
                .toLowerCase(),
        }

        let xxx = await putSanPham(ItemSua._id, DataPost);





        props.getItemsAll("sanpham");

    }

    function handleAddLayer() {
        var item = {
            chatLieu: "theuloai1",
            chieuDai: 0,
            chieuRong: 0,
            soMatIn: 0.5,
            catStatus: false,
            khacStatus: false
        }
        setlop([...lop, item])
    }
    function changeLopCL(item, key) {
        var lopNew = [...lop];
        lopNew[key] = item;
        setlop(lopNew);
    }

    function xoaLayer(key) {
        setlop((prevLop) => prevLop.filter((_, index) => index !== key));
    }
    const handleChangeThongSoTong = (type, value) => {
        let typeName = type;
        let val = value;
        if (
            !statuscanChageTST &&
            (typeName == "chieuDai" || typeName == "chieuRong")
        ) {
            console.log("Không được thay đổi giá trị khi canChageTST = false và typeName là chieuDai hoặc chieuRong");
            return; // Dừng hàm nếu điều kiện không thỏa mãn
        }

        if (typeName == "chieuDai") {
            typeName = "chieuNgang";
            for (let i = 0; i < lop.length; i++) {
                if (parseFloat(val) < parseFloat(lop[i].chieuDai)) {
                    val = parseFloat(lop[i].chieuDai);

                }
            }
            val = parseFloat(val) * 2.54 + 1


        }
        else if (typeName == "chieuRong") {
            typeName = "chieuDoc";
            for (let i = 0; i < lop.length; i++) {
                if (parseFloat(val) < parseFloat(lop[i].chieuRong)) {
                    val = parseFloat(lop[i].chieuRong);

                }
            }
            val = parseFloat(val) * 2.54 + 0.5


        }


        setThongSoTong((prevState) => ({
            ...prevState,
            [typeName]: val,
        }));
    };

    function handleCanChageTST() {
        let status = thongSoTong.canChageTST;

        handleChangeThongSoTong("canChageTST", !status)


    }
    let statuscanChageTST = thongSoTong.canChageTST;

    const [thueInput, setThueInput] = useState(thongSoTong.phanTramThue || 0);

    function handleDeletePhuKien(key) {
        let phuKienTST = thongSoTong.phuKien;
        phuKienTST.splice(key, 1);
        handleChangeThongSoTong("phuKien", phuKienTST)


    }



    let ListPhuKien = thongSoTong.phuKien.map(item => {


        let arrPK = phuKien.filter(itemF => itemF._id == item)

        if (arrPK.length > 0) return arrPK[0]

    }).filter(itemx => itemx != undefined);
    let canNangTheTich = thongSoTong.chieuDoc * thongSoTong.chieuNgang * thongSoTong.doCao / 5
    function changeVipAll(param, key, type, keyxx) {
        if (type !== "vipSale") {
            let item = thongSoTong[type];


            item[key] = param;
            setThongSoTong((prevState) => ({
                ...prevState,
                [type]: item,
            }));
        }
        else {
            let item = thongSoTong.vipSale;
            item[keyxx][key] = param;
            setThongSoTong((prevState) => ({
                ...prevState,
                [type]: item,
            }));
        }

    }
    function changeNoteVipSale(param, keyxx) {
        let item = thongSoTong.noteVipSale;
        item[keyxx] = param;
        setThongSoTong((prevState) => ({
            ...prevState,
            noteVipSale: item,
        }));
    }
    function addVipSale() {
        let item = thongSoTong.vipSale;
        let itemNote = thongSoTong.noteVipSale;
        item.push([0, 0, 0, 0, 0])
        itemNote.push("");


        setThongSoTong((prevState) => ({
            ...prevState,
            vipSale: item,
            noteVipSale: itemNote,
        }));
    }
    function xoaVipSale(keyxx) {
        let item = thongSoTong.vipSale;
        let newArr = item.filter((_, index) => index !== keyxx);

        setThongSoTong((prevState) => ({
            ...prevState,
            vipSale: newArr,
        }));
    }
    let TongTienSX = tongTienLop(lop, vatLieu, thongSoTong, phuKien);
    let canTien = (thongSoTong.canNang > canNangTheTich) ? thongSoTong.canNang : canNangTheTich;

    console.log(thongSoTong)

    let baseValue = ((TongTienSX / (Rate)) + (0.4 * ((thongSoTong.vipChot[3]) - TongTienSX / Rate))) * 0.7;
    let giaThue = (Math.max(2, Math.min(8, Math.ceil(baseValue))) * (0.2 + thongSoTong.phanTramThue / 100)).toFixed(2)

    let chiphivanhanh = vatLieu.filter(item => item.nameCode == "chiphivanhanh")[0].price;


    return (
        <div className="cngjgfh svdvs">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-8">
                        <div className="themspsss">
                            <Button variant="contained" onClick={props.dongCTN} className="btn btn-danger btvrrr"  >X </Button>
                            <div className="container">

                                <div className="row mt-2 mb-3 glrsjngsl">
                                    <div className="col-12">
                                        <Button variant="contained" onClick={handleAddLayer} >Thêm lớp thêu</Button>
                                    </div>
                                    <div className="col-12">
                                        {lop.map((item, key) => <LayerThemVL vatLieu={vatLieu} phuKien={phuKien} key={key} item={item} handleChangeThongSoTong={handleChangeThongSoTong} changeLopCL={changeLopCL} stt={key} xoaLayer={xoaLayer} />)}
                                    </div>

                                </div>


                                <div className="row glrsjngsl">
                                    <div className="col-12">
                                        <Button variant="contained" onClick={() => setisOpenSelectPK(true)} >Thêm áo, Phụ Kiện</Button>
                                        <div className="row">
                                            {(ListPhuKien.length > 0) && ListPhuKien.map((item, key) => <div className="col-2" key={key}>

                                                <div className="divtongvl vsdv">
                                                    <IconButton aria-label="delete" className='iconbtdlelepk' onClick={() => handleDeletePhuKien(key)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <div className="tenpk">Tên: <span className="hhhg">{item.name}</span></div>
                                                    <div className="anhpkvl">
                                                        {item.imageUrl ? <Image priority src={item.imageUrl} alt="My GIF" width={500} height={300} className="anhpkvl" /> : <></>}
                                                    </div>

                                                </div>
                                            </div>)
                                            }

                                        </div>

                                        <Modal
                                            open={isOpenSelectPK}
                                            onClose={CloseSelectPK}
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
                                                    onClick={CloseSelectPK}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        zIndex: 99,
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                                <SelectPhuKien_CLL onClose={CloseSelectPK} phuKien={props.phuKien} />
                                            </Box>
                                        </Modal>
                                    </div>
                                </div>


                                <div className="container">
                                    <div className="row">
                                        <div className="col-12">
                                            <h4>cân nặng ước tính: <span className="vdf">{CanNang_UocLuong}</span></h4>
                                        </div>
                                        {initialWHZ.map((item, key) => <div className="col-2" key={key}>
                                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                                                <TextField id="outlined-basic" label={item.nameSTT} variant="outlined" type="number" size="small"
                                                    value={thongSoTong[item.valueSTT]}
                                                    onChange={(e) => handleChangeThongSoTong(item.valueSTT, e.target.value)}
                                                    placeholder="Nhập số"
                                                    disabled={!statuscanChageTST}
                                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">{item.dv}</InputAdornment>, }, }}
                                                />
                                            </Box>
                                        </div>)}

                                        <div className="col-2" >
                                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                                                <TextField id="outlined-basic" label={"Tổng Cân"} variant="outlined" type="number" size="small"
                                                    value={thongSoTong.canNang}
                                                    onChange={(e) => handleChangeThongSoTong("canNang", e.target.value)}
                                                    placeholder="Nhập số"
                                                    disabled={!statuscanChageTST}
                                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">{"gam"}</InputAdornment>, }, }}
                                                />
                                            </Box>
                                        </div>

                                    </div>



                                    <div className="row">

                                        <div className="col-3">
                                            <FormGroup>
                                                <FormControlLabel control={<Switch color="warning" onChange={handleCanChageTST} checked={thongSoTong.canChageTST} />} label="Tự Động" />

                                            </FormGroup>
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-6">
                                            <div className="row">

                                                <div className="col-12">
                                                    <TextField
                                                        label="Product"
                                                        variant="standard"
                                                        color="warning"
                                                        focused
                                                        value={thongSoTong.product || ''}
                                                        onChange={(e) => handleChangeThongSoTong("product", e.target.value)}
                                                        placeholder="Nhập Product Name"
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        label="Variant"
                                                        variant="standard"
                                                        color="warning"
                                                        focused
                                                        value={thongSoTong.variant || ''}
                                                        onChange={(e) => handleChangeThongSoTong("variant", e.target.value)}
                                                        placeholder="Nhập Variant Name"
                                                        fullWidth
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <TextField
                                                        label="note"
                                                        variant="standard"

                                                        focused
                                                        value={thongSoTong.note || ''}
                                                        onChange={(e) => handleChangeThongSoTong("note", e.target.value)}
                                                        placeholder="Nhập note"
                                                        fullWidth
                                                    />
                                                </div>

                                                <div className="col-12">
                                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                        <InputLabel id="demo-simple-select-standard-label">Chất Liệu</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-standard-label"
                                                            id="demo-simple-select-standard"
                                                            value={thongSoTong.xop}
                                                            onChange={(e) => handleChangeThongSoTong("xop", e.target.value)}
                                                            label="Chọn Loại Xôp"
                                                        >
                                                            <MenuItem value="xopmong">xốp 0.5mm</MenuItem>
                                                            <MenuItem value="xop3mm">xốp 3mm</MenuItem>
                                                            <MenuItem value="xop5mm">xốp 5mm</MenuItem>
                                                            <MenuItem value="xop10mm">xốp 10mm</MenuItem>
                                                            <MenuItem value="xop20mm">xốp 20mm</MenuItem>
                                                            <MenuItem value="xopno">xốp nổ</MenuItem>


                                                        </Select>
                                                    </FormControl>
                                                </div>

                                                <div className="col-12">
                                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                        <InputLabel id="demo-simple-select-standard-label">Loại thẻ</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-standard-label"
                                                            id="demo-simple-select-standard"
                                                            value={thongSoTong.type}
                                                            onChange={(e) => handleChangeThongSoTong("type", e.target.value)}
                                                            label="Loại thẻ"
                                                        >
                                                            <MenuItem value="demo">demo</MenuItem>
                                                            <MenuItem value="test">test</MenuItem>
                                                            <MenuItem value="publish">publish</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>

                                            </div>




                                        </div>
                                        <div className="col-6">

                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    Tải lên ảnh:
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    startIcon={<PhotoCamera />}
                                                    color="primary"
                                                >
                                                    Chọn ảnh
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleChonAnh}
                                                        hidden
                                                    />
                                                </Button>

                                                <div className="anhtailen">
                                                    <img src={(image) ? image : (thongSoTong.anh !== "") ? thongSoTong.anh : null} alt="Uploaded" className='amttt' />
                                                </div>


                                            </Box>

                                        </div>


                                    </div>
                                </div>




                                <div className="container">
                                    <div className="row">
                                        <Button variant="contained" endIcon={<SendIcon />} onClick={HandlethemSanPham}>
                                            Send
                                        </Button>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}
                    {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}
                    {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}
                    <div className="col-4 vvdvssdvsdvsdv">
                        <div className="row">

                            {STATUS_ADMIN < 3 && <div className="prostt">
                                <div className="col-12">
                                    Giá Chốt:
                                    <div className="row dpnam">
                                        {thongSoTong.vipChot.map((item, key) => <div className="pnampt" key={key}>
                                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '100%' } }} noValidate autoComplete="off">
                                                <TextField id="outlined-basic" label={key == 0 ? "Titanium" : (key == 1 ? "Platinum" : (key == 2 ? "Diamond" : (key == 3 ? "E 1" : (key == 4 ? "E 2" : "E 3"))))} variant="outlined" type="text" size="small"
                                                    value={item}
                                                    onChange={(e) => changeVipAll(e.target.value, key, "vipChot")}
                                                    placeholder="Nhập số"
                                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">$</InputAdornment>, }, }}
                                                    sx={key == 3 ? {
                                                        "& .MuiOutlinedInput-root": {
                                                            "& fieldset": { borderColor: "red" }, // Viền mặc định màu đỏ
                                                            "&:hover fieldset": { borderColor: "darkred" }, // Khi hover
                                                            "&.Mui-focused fieldset": { borderColor: "red" }, // Khi focus
                                                        }
                                                    } : {}}
                                                />
                                            </Box>
                                        </div>)}

                                    </div>
                                </div>


                                <div className="col-12">
                                    Giá Anh Tuấn Đưa:
                                    <div className="row dpnam">
                                        {thongSoTong.vipaTuan.map((item, key) => <div className="pnampt" key={key}>
                                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '100%' } }} noValidate autoComplete="off">
                                                <TextField id="outlined-basic" label={key == 0 ? "Titanium" : (key == 1 ? "Platinum" : (key == 2 ? "Diamond" : (key == 3 ? "E 1" : "E 2")))} variant="outlined" type="text" size="small"
                                                    value={item}
                                                    onChange={(e) => changeVipAll(e.target.value, key, "vipaTuan")}
                                                    placeholder="Nhập số"
                                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">$</InputAdornment>, }, }}
                                                />
                                            </Box>
                                        </div>)}
                                    </div>
                                </div>



                                <div className="col-12">
                                    Giá Sale Đưa:


                                    {thongSoTong.vipSale.map((itemxx, keyxx) => <div className="row vtnvipsl dpnam mt-2" key={keyxx}>
                                        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '100%' } }} noValidate autoComplete="off">
                                            <TextField id="outlined-basic" label={"note "} variant="outlined" type="text" size="small"
                                                value={thongSoTong.noteVipSale[keyxx]}
                                                onChange={(e) => changeNoteVipSale(e.target.value, keyxx)}

                                            />
                                        </Box>

                                        {itemxx.map((item, key) => <div className="pnampt" key={key}>
                                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '100%' } }} noValidate autoComplete="off">
                                                <TextField id="outlined-basic" label={key == 0 ? "Titanium" : (key == 1 ? "Platinum" : (key == 2 ? "Diamond" : (key == 3 ? "E 1" : "E 2")))} variant="outlined" type="text" size="small"
                                                    value={item}
                                                    onChange={(e) => changeVipAll(e.target.value, key, "vipSale", keyxx)}
                                                    placeholder="Nhập số"
                                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">$</InputAdornment>, }, }}
                                                />
                                            </Box>
                                        </div>)}
                                        {(keyxx === 0) && <div className="xoavipsal">
                                            <Add onClick={addVipSale} />
                                        </div>}
                                        {(keyxx !== 0) && <div className="xoavipsal">
                                            <DeleteIcon onClick={() => xoaVipSale(keyxx)} />
                                        </div>}

                                    </div>)}
                                </div>



                                <div className="col-12 mtcontainer mt-2">
                                    {STATUS_ADMIN == 1 && <div className="tenpk">Chi phí: <span className="hhhg">{(TongTienSX / (Rate)).toFixed(2)} ($)</span></div>}
                                    <div className="tenpk">Giá bán VIP4: <span className="hhhg">{thongSoTong.vipChot[3]} ($)</span></div>
                                    <div className="tenpk">Chi phí / giá bán: <span className="hhhg">{(TongTienSX * 100 / (Rate * thongSoTong.vipChot[3])).toFixed(2)} (%)</span></div>
                                    <div className="tenpk">Tổng lợi nhuận: <span className="hhhg">{((thongSoTong.vipChot[3]) - TongTienSX / Rate).toFixed(2)} ($)</span></div>
                                    <div className="tenpk">% Lợi nhuận: <span className="hhhg">{(((thongSoTong.vipChot[3]) - TongTienSX / Rate) * 100 / thongSoTong.vipChot[3]).toFixed(2)} (%)</span></div>
                                    {/* {STATUS_ADMIN == 1 && <div className="tenpk">Lợi nhuận sản xuất: <span className="hhhg">{(0.4 * ((thongSoTong.vipChot[3]) - TongTienSX / Rate)).toFixed(2)} ($)</span></div>} */}
                                    <div className="tenpk">giá bán FullFill: <span className="hhhg ">{((TongTienSX / (Rate)) + (0.4 * ((thongSoTong.vipChot[3]) - TongTienSX / Rate))).toFixed(2)} ($)</span></div>
                                    <div className="tenpk d-flex align-items-center gap-2">
                                        <span>thuế:</span>
                                        <input
                                            type="number"
                                            value={thueInput}
                                            onChange={(e) => setThueInput(e.target.value)}
                                            className="form-control"
                                            style={{ width: '60px', display: 'inline-block' }}
                                        />
                                        <span>(%)</span>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={suaThue}
                                        >
                                            sửa
                                        </Button>
                                        ===={giaThue} USDT

                                    </div>
                                </div>
                            </div>
                            }

                            <div className="col-12 mtcontainer mt-2">
                                <div className="tenpk">Cân thể tích: <span className={"hhhg " + ((thongSoTong.canNang < canNangTheTich) ? "re" : "")}>{canNangTheTich.toFixed(2)} (g)</span></div>
                                <div className="tenpk">Cân thực tế: <span className={"hhhg " + ((thongSoTong.canNang > canNangTheTich) ? "re" : "")}>{thongSoTong.canNang} (g)</span></div>
                                <div className="tenpk">Shipping cost: <span className="hhhg"> {(caculator_ShipingCost(ShippingCost, canTien)).toFixed(2)} ($)</span></div>
                                <div className="tenpk">Shipping fee: <span className="hhhg"> {(caculator_ShipingCost(ShippingCost, canTien) * 1.1).toFixed(2)} ($)</span></div>

                            </div>
                            {STATUS_ADMIN == 1 && <div className="col-12 mtcontainer mt-2">
                                <div className="tenpk">Tiền vật liệu: <span className="hhhg">{isNaN(tienVL.tienVatLieu) ? "0" : Math.floor(tienVL.tienVatLieu).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền phụ kiện: <span className="hhhg">{isNaN(tienVL.tienPhuKien) ? "0" : Math.floor(tienVL.tienPhuKien).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền vỏ hộp: <span className="hhhg">{isNaN(tienVL.tienHop) ? "0" : Math.floor(tienVL.tienHop).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền thùng hàng: <span className="hhhg">{isNaN(tienVL.tienThungDongHang) ? "0" : Math.floor(tienVL.tienThungDongHang).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền mực: <span className="hhhg">{isNaN(tienVL.tienMuc) ? "0" : Math.floor(tienVL.tienMuc).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền công in: <span className="hhhg">{isNaN(tienVL.tienIn) ? "0" : Math.floor(tienVL.tienIn).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền công cắt: <span className="hhhg">{isNaN(tienVL.tienCat) ? "0" : Math.floor(tienVL.tienCat).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền công khắc: <span className="hhhg">{isNaN(tienVL.tienKhac) ? "0" : Math.floor(tienVL.tienKhac).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền thiết kế: <span className="hhhg">{isNaN(tienVL.tienThietke) ? "0" : Math.floor(tienVL.tienThietke).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền đóng gói: <span className="hhhg">{isNaN(tienVL.tienDongGoi) ? "0" : Math.floor(tienVL.tienDongGoi).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền điện: <span className="hhhg">{isNaN(tienVL.tienDien) ? "0" : Math.floor(tienVL.tienDien).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền băng dính: <span className="hhhg">{isNaN(tienVL.tienBangDinh) ? "0" : Math.floor(tienVL.tienBangDinh).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền keo dán: <span className="hhhg">{isNaN(tienVL.tienKeoDan) ? "0" : Math.floor(tienVL.tienKeoDan).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền màng bọc: <span className="hhhg">{isNaN(tienVL.tienMangBoc) ? "0" : Math.floor(tienVL.tienMangBoc).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền xốp: <span className="hhhg">{isNaN(tienVL.tienXop) ? "0" : Math.floor(tienVL.tienXop).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Tiền chiết khấu máy: <span className="hhhg">{isNaN(tienVL.tienChietKhauMay) ? "0" : Math.floor(tienVL.tienChietKhauMay).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">Phí vận Hành {chiphivanhanh}%: <span className="hhhg">{Math.floor(TongTienSX * chiphivanhanh / 100).toLocaleString("en-US")} (đ)</span></div>
                                <div className="tenpk">
                                    Tổng chi phí:    {Math.floor(TongTienSX).toLocaleString("en-US")} (đ)
                                </div>

                            </div>}

                        </div>

                    </div>
                </div>
            </div>
        </div>





    );
}
