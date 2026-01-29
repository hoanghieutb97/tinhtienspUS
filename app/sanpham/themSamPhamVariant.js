'use client';
import { useState, useEffect } from 'react';
import LayerThemVLVariant from './layerThemVLVariant';
import { caculator_ShipingCost, tongTienLop, tinhCanNang, cal_Status, tinhTienVL, createChatLark, URL_upload_cloudinary, initialWHZ, tagUserType, postSanPham, putSanPham } from '@/lib/utils';
import { Box, InputLabel, MenuItem, FormControl, Select, TextField, InputAdornment, Button, Typography, IconButton, FormControlLabel, FormGroup, Switch, Modal } from '@mui/material';
import { Send as SendIcon, PhotoCamera, Add, Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Image from 'next/image';
import SelectPhuKien_CLL from './selectPhuKien_CLL';

export default function ThemSanPham(props) {
    let typeCPN = props.typeCPN;
    let ItemSua = { ...props.data };
    let styleSP = props.styleSP;
    let Rate = props.Rate;
    const [Product, setProduct] = useState("");
    const [variant, setvariant] = useState("");
    const [phuKienVariant, setphuKienVariant] = useState([]);
    const [PhuKienTong, setPhuKienTong] = useState([]);
    const [TongTatCa, setTongTatCa] = useState([]);
    const [tenVariantType, setTenVariantType] = useState(0);
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
        phuKien: [],
        vipaTuan: [0, 0, 0, 0, 0],
        vipChot: [0, 0, 0, 0, 0, 0],
        vipSale: [[0, 0, 0, 0, 0]],
        noteVipSale: [""],
        canChageTST: true,
        idChat: "",
        dateCreate: Date.now()
    }
    const vatLieu = props.vatLieu;
    const phuKien = props.phuKien;

    let itemLayerLop = {
        name: "", value: [{
            chatLieu: "mica3mm",
            chieuDai: 0,
            chieuRong: 0,
            soMatIn: 1,
            catStatus: true,
            khacStatus: false
        }]
    }
    const [lop, setlop] = useState([itemLayerLop]);
    const [KichThuocVariant, setKichThuocVariant] = useState([]);
    const [isOpenSelectPK, setisOpenSelectPK] = useState(false);
    const [isOpenSelectPKTong, setisOpenSelectPKTong] = useState(false);

    const [thongSoTong, setThongSoTong] = useState(defaultThongSoTong);

    const [ImageUrlPC, setImageUrlPC] = useState(null);
    const [ImageBase64, setImageBase64] = useState();
    const [ImageCloudiaryUrl, setImageCloudiaryUrl] = useState(undefined);

    // Tự động tính toán tenVariant khi tenVariantType thay đổi
    useEffect(() => {
        if (lop.length > 0 || phuKienVariant.length > 0 || KichThuocVariant.length > 0) {
            tinhToanTongTatCa([...lop], [...phuKienVariant], [...PhuKienTong], [...KichThuocVariant], vatLieu, phuKien);
        }
    }, [tenVariantType]);

    function CloseSelectPK(item) {
        setisOpenSelectPK(false);
        setphuKienVariant([...phuKienVariant, { name: "", value: item }])
    }
    function CloseSelectPKTong(item) {
        setisOpenSelectPKTong(false);
        console.log([...PhuKienTong, ...item]);

        setPhuKienTong([...PhuKienTong, ...item])
    }

    function handleDeletePhuKien(key) {
        let phuKienTST = [...phuKienVariant];
        phuKienTST.splice(key, 1);
        setphuKienVariant(phuKienTST)
    }

    function handleDeletePhuKienTong(key) {
        let phuKienTST = [...PhuKienTong];
        phuKienTST.splice(key, 1);
        setPhuKienTong(phuKienTST)
    }


    const handleChonAnh = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageUrlPC(imageUrl);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImageBase64(base64String); // Cần định nghĩa setBase64Image trước
            };
            reader.readAsDataURL(file); // Đọc file dưới dạng Data URL (Base64)
        }
        else {
            setImageUrlPC(null);
            setImageBase64(undefined)
        }
    };

    function checkNewMessenger(DataPost) {

        if (DataPost.thongSoTong.idChat == "") return true
        return false

    }


    const HandlethemSanPham = async () => {
        if (ImageCloudiaryUrl == undefined) {
            alert("Vui lòng tải ảnh lên")
            return
        }
        else {


            props.setLoading(true);
            for (let i = 0; i < TongTatCa.length; i++) {
                let DataPost = TongTatCa[i];
                console.log(DataPost);
                let statusPostSanPham = await postSanPham(DataPost);
                console.log(statusPostSanPham);

            }

            props.getItemsAll("sanpham");
            props.setLoading(false)
        }
    };





    function handleAddLayer(key) {

        let lopxx = [...lop];
        lopxx[key].value.push(itemLayerLop.value[0]);
        setlop(lopxx)
    }
    function handleAddLopVariant() {
        setlop([...lop, itemLayerLop])
    }
    function handleDeleteLopVariant(key) {
        let lopxx = [...lop];
        lopxx.splice(key, 1);
        setlop(lopxx)
    }
    function changeLopCL(item, key, keyVariant) {
        var lopNew = [...lop];
        lopNew[keyVariant].value[key] = { ...item };
        setlop(lopNew);
    }
    function changeNameLopVariant(key, value) {
        var lopNew = [...lop];
        lopNew[key].name = value;
        setlop(lopNew);
    }

    function xoaLayer(key, keyL) {
        let lopxx = [...lop];

        lopxx[key].value.splice(keyL, 1);
        setlop(lopxx)
    }

    let statuscanChageTST = thongSoTong.canChageTST;




    let ListPhuKien = phuKienVariant.map(item => {
        let arrPK = phuKien.filter(itemF => itemF._id == item.value)
        if (arrPK.length > 0) return { name: item.name, value: arrPK[0] }

    });
    let ListPhuKienTong = PhuKienTong.map(item => {
        let arrPK = phuKien.filter(itemF => itemF._id == item)
        if (arrPK.length > 0) return arrPK[0]

    });

    function changePhuKienVariantName(key, value) {
        let lopxx = [...phuKienVariant];
        lopxx[key].name = value;
        setphuKienVariant(lopxx)
    }
    function handleAddKichThuocVariant() {
        setKichThuocVariant([...KichThuocVariant, { name: "", value: [0, 0] }])
    }
    function changeKichThuocVariant(key, value, keySTT) {
        let kt = [...KichThuocVariant];
        kt[key].value[keySTT] = value;
        setKichThuocVariant(kt)
    }
    function changeNameKichThuocVariant(key, value) {
        let kt = [...KichThuocVariant];
        kt[key].name = value;
        setKichThuocVariant(kt)
    }

    function xoaKichThuocVariant(key) {
        let kt = [...KichThuocVariant];
        kt.splice(key, 1);
        setKichThuocVariant(kt)
    }

    // Hàm tạo tenVariant dựa trên loại được chọn
    function createTenVariant(k, l, p) {
        switch (tenVariantType) {
            case 0:
                return `${k.name}/${l.name}${p.name == "" ? "" : "/"}${p.name}`.trim();
            case 1:
                return `${l.name == "" ? "" : (l.name + "/")}${k.name}${p.name == "" ? "" : ("/" + p.name)}`.trim(); // ACRYLIC/8X8 INCHES
            case 2:
                return `${l.name == "" ? "" : (l.name + "/")}${p.name}${k.name == " " ? " " : (k.name)}`.trim(); // ACRYLIC/8X8 INCHES
            case 3:
                return `${p.name == "" ? "" : (p.name + "/")}${k.name}${p.name == "" ? "" : ("/" + l.name)}`.trim(); // ACRYLIC/8X8 INCHES
      
            case 5:
                return `${k.name == "" ? "" : (k.name + "/")}${p.name == "" ? "" : p.name}${l.name}`.trim(); // 8X8 INCHES/ACRYLIC
     
            default:
                return `${p.name == "" ? "" : (p.name + "/")}${k.name}${p.name == "" ? "" : ("/" + l.name)}`.trim();
        }
    }

    function tinhToanTongTatCa(lop, phuKienVariant, PhuKienTong, KichThuocVariant, vatLieu, phuKien) {


        function mixData(lop, phuKienVariant, PhuKienTong, KichThuocVariant, vatLieu, phuKien) {
            let result = [];


            // Nếu bất kỳ mảng nào rỗng, thay thế bằng mảng có một phần tử trống
            if (lop.length === 0) lop = [{ name: "", value: [] }];
            if (phuKienVariant.length === 0) phuKienVariant = [{ name: "", value: [] }];
            if (KichThuocVariant.length === 0) KichThuocVariant = [{ name: "", value: [] }];

            // Mix tất cả các mảng với nhau
            lop.forEach(l => {
                phuKienVariant.forEach(p => {
                    KichThuocVariant.forEach(k => {

                        let tenVariant = createTenVariant(k, l, p);
                        let chieuNX = ((+k.value[0]) * 2.54 + 1) < 10 ? 10 : ((+k.value[0]) * 2.54 + 1);
                        let chieuDX = ((+k.value[1]) * 2.54 + 0.5) < 11.5 ? 11.5 : ((+k.value[0]) * 2.54 + 0.5);
                        let thongSoTong = {
                            doCao: "1.5",
                            chieuNgang: chieuNX,
                            chieuDoc: chieuDX,
                            xop: "xop5mm",
                            anh: ImageCloudiaryUrl,
                            product: Product,
                            variant: tenVariant,
                            note: "không",
                            type: "demo",
                            canNang: "",
                            phuKien: [p.value[0], ...PhuKienTong].filter(itemp => itemp !== undefined),
                            canChageTST: true,
                            idChat: "",
                            dateCreate: Date.now(),
                            vipaTuan: [0, 0, 0, 0, 0],
                            vipChot: [0, 0, 0, 0, 0, 0],
                            vipSale: [[0, 0, 0, 0, 0]],
                            noteVipSale: [""],

                        }
                        let lop = l.value.map(item => ({ ...item, chieuDai: k.value[0], chieuRong: k.value[1] }));

                        result.push({
                            lop: lop,
                            name: Product,
                            nameCode: Product.normalize("NFD") // Chuyển các ký tự có dấu thành dạng kết hợp (e.g., 'Hiếu' -> 'Hiếu')
                                .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu kết hợp
                                .replace(/[^a-zA-Z]/g, "") // Giữ lại các ký tự a-z, A-Z
                                .toLowerCase(),
                            thongSoTong: { ...thongSoTong, canNang: Math.floor(tinhCanNang(lop, vatLieu, thongSoTong, phuKien)) }


                        });
                    });
                });
            });
            return result;
        }
        const mixedData = mixData(lop, phuKienVariant, PhuKienTong, KichThuocVariant, vatLieu, phuKien);
        console.log(mixedData);

        setTongTatCa(mixedData)

    }
    async function handleUpAnh() {
        // kiểm tra xem up ảnh chưa, chưa up thì up

        let images = await URL_upload_cloudinary(ImageBase64);
        if (!images) {
            alert("Lỗi khi up ảnh")
            setImageCloudiaryUrl(undefined);
           
        }
        else setImageCloudiaryUrl(images)

    }
    console.log(ImageCloudiaryUrl);

    return (
        <div className="cngjgfh svdvs">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="themspsss">
                            <Button variant="contained" onClick={props.dongCTN} className="btn btn-danger btvrrr"  >X </Button>
                            <div className="container">
                                <div className="col-12">
                                    <button onClick={() => tinhToanTongTatCa([...lop], [...phuKienVariant], [...PhuKienTong], [...KichThuocVariant], vatLieu, phuKien)}>Tính Toán Variant</button>
                                    {TongTatCa.map((item, key) => <div className="svvsdvtg" key={key}>
                                       
                                        <p className='p-0 m-0'><span className="prooducttongggfgg">{item.thongSoTong.variant}</span></p>
                                    </div>
                                    )}
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
                                                    value={Product || ''}
                                                    onChange={(e) => setProduct(e.target.value)}
                                                    placeholder="Nhập Product Name"
                                                    fullWidth
                                                />

                                            </div>

                                            <div className="col-12 mt-3">
                                                <FormControl fullWidth>
                                                    <InputLabel id="ten-variant-type-label">Loại tên Variant</InputLabel>
                                                    <Select
                                                        labelId="ten-variant-type-label"
                                                        id="ten-variant-type-select"
                                                        value={tenVariantType}
                                                        label="Loại tên Variant"
                                                        onChange={(e) => setTenVariantType(e.target.value)}
                                                    >
                                                        <MenuItem value={0}>Kích thước/Lớp/Phụ kiện</MenuItem>
                                                        <MenuItem value={1}>Lớp/Kích thước/Phụ kiện</MenuItem>
                                                        <MenuItem value={2}>Lớp/Phụ kiện Kích thước</MenuItem>
                                                        <MenuItem value={3}>Phụ kiện/Kích thước/Lớp</MenuItem>
                                                        <MenuItem value={5}>Kích thước/Phụ kiện/Lớp</MenuItem>
                                                        
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
                                                <img src={(ImageUrlPC) ? ImageUrlPC : (thongSoTong.anh !== "") ? thongSoTong.anh : null} alt="Uploaded" className='amttt' />
                                            </div>
                                            <Button
                                                variant="contained"
                                                color={(ImageCloudiaryUrl == undefined) ? "primary" : "secondary"}
                                                onClick={handleUpAnh}
                                            >
                                                UpLoad

                                            </Button>

                                        </Box>

                                    </div>


                                </div>
                                <div className="col-12">
                                    <Button variant="contained" onClick={() => handleAddKichThuocVariant()} >Thêm Kích Thước </Button>
                                    {KichThuocVariant.map((itemk, keyk) => <div className="vsdv sdvdsvds" key={keyk}  >
                                        {itemk.value.map((itemSTT, keySTT) => <Box key={keySTT} component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                                            <TextField id="outlined-basic" label={keySTT == 0 ? "Chiều dài" : "chiều Rộng"} variant="outlined" type="number" size="small"
                                                value={itemSTT || ''}
                                                onChange={(e) => changeKichThuocVariant(keyk, _.toNumber(e.target.value), keySTT)}
                                                placeholder="Nhập số"
                                                slotProps={{ input: { endAdornment: <InputAdornment position="end">inch</InputAdornment>, }, }}
                                            />
                                        </Box>)}

                                        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '40ch' } }} noValidate autoComplete="off">
                                            <TextField id="outlined-basic" label="nhập tên" variant="outlined" type="text" size="small"
                                                value={itemk.name || ''}
                                                onChange={(e) => changeNameKichThuocVariant(keyk, e.target.value)}
                                                placeholder="Tên"
                                                slotProps={{ input: { endAdornment: <InputAdornment position="end">Tên</InputAdornment>, }, }}
                                            />
                                        </Box>
                                        <button onClick={() => xoaKichThuocVariant(keyk)}>delete</button>
                                    </div>)}
                                </div>
                                <div className="row mt-2 mb-3 glrsjngsl">

                                    <div className="col-12">
                                        {lop.map((item, key) => <div className="col-12" key={key}>
                                            <div className="col-12">
                                                <Button variant="contained" onClick={() => handleAddLayer(key)} >Thêm lớp chất liệu </Button>
                                                <Button variant="contained" onClick={() => handleAddLopVariant(key)} >Thêm variant </Button>
                                                <Button variant="contained" onClick={() => handleDeleteLopVariant(key)} >Xóa Variant </Button>
                                            </div>

                                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '70ch' } }} noValidate autoComplete="off">
                                                <TextField id="outlined-basic" label="nhập tên" variant="outlined" type="text" size="small"
                                                    value={item.name || ''}
                                                    onChange={(e) => changeNameLopVariant(key, e.target.value)}
                                                    placeholder="Tên"
                                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">Tên</InputAdornment>, }, }}
                                                />
                                            </Box>
                                            {item.value.map((itemL, keyL) => <LayerThemVLVariant keyL vatLieu={vatLieu} phuKien={phuKien} key={keyL} item={itemL} changeLopCL={changeLopCL} keyVariant={key} stt={keyL} xoaLayer={() => xoaLayer(key, keyL)} />)}

                                        </div>)}

                                    </div>

                                </div>


                                <div className="row glrsjngsl">
                                    <div className="col-12">
                                        <Button variant="contained" onClick={() => setisOpenSelectPK(true)} >Thêm Phụ Kiện</Button>
                                        <div className="row">
                                            {(ListPhuKien.length > 0) && ListPhuKien.map((item, key) => <div className="col-2" key={key}>
                                                <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                                                    <TextField id="outlined-basic" label="nhập tên" variant="outlined" type="text" size="small"
                                                        value={item.name || ''}
                                                        onChange={(e) => changePhuKienVariantName(key, e.target.value)}
                                                        placeholder="Tên"
                                                        slotProps={{ input: { endAdornment: <InputAdornment position="end">Tên</InputAdornment>, }, }}
                                                    />
                                                </Box>
                                                <div className="divtongvl vsdv">
                                                    <IconButton aria-label="delete" className='iconbtdlelepk' onClick={() => handleDeletePhuKien(key)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <div className="tenpk">Tên: <span className="hhhg">{item.value.name}</span></div>
                                                    <div className="anhpkvl">
                                                        {item.value.imageUrl ? <Image priority src={item.value.imageUrl} alt="My GIF" width={500} height={300} className="anhpkvl" /> : <></>}
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

                                //////////////////phu kien tong
                                <div className="row glrsjngsl">
                                    <div className="col-12">
                                        <Button variant="contained" onClick={() => setisOpenSelectPKTong(true)} >Thêm Phụ Kiện</Button>
                                        <div className="row">
                                            {(ListPhuKienTong.length > 0) && ListPhuKienTong.map((item, key) => <div className="col-2" key={key}>
                                                <div className="divtongvl vsdv">
                                                    <IconButton aria-label="delete" className='iconbtdlelepk' onClick={() => handleDeletePhuKienTong(key)}>
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
                                            open={isOpenSelectPKTong}
                                            onClose={CloseSelectPKTong}
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
                                                    onClick={CloseSelectPKTong}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        zIndex: 99,
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                                <SelectPhuKien_CLL onClose={CloseSelectPKTong} phuKien={props.phuKien} />
                                            </Box>
                                        </Modal>
                                    </div>
                                </div>


                                <div className="container">



                                    <div className="row">


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
                </div>
            </div>
        </div >





    );
}
