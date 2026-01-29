'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import ShowVariant from './showVariant';
import ThemSanPham from './themSamPham';

import ThemSanPhamVariant from './themSamPhamVariant';

import { Box, Modal, Button, IconButton, Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { filter, functions } from 'lodash';
import { tongTienLop } from "@/lib/utils";
import { cal_Status } from "@/lib/utils";

function ShowSanPham(props) {
    const [activeProduct, setactiveProduct] = useState();
    const [showProduct, setshowProduct] = useState(false);
    const [typeSanPham, settypeSanPham] = useState("all");
    const [ACtiveItem, setACtiveItem] = useState();
    const ListStatusActive = ["all", "demo", "test", "publish"];
    const [STATUS_ADMIN, setStatusAdmin] = useState(5);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userStatus = localStorage.getItem("userStatus");
            if (userStatus !== null) {
                setStatusAdmin(cal_Status(userStatus));
            }
        }
    }, []);

    // const STATUS_ADMIN = cal_Status(localStorage.getItem("userStatus"))
    const groupByProduct = (list) => {
        const grouped = {};
        list.forEach((item) => {
            const productName = item.thongSoTong.product.trim().toLowerCase();

            if (!grouped[productName]) {
                grouped[productName] = { data: [], image: "" };
            }

            grouped[productName].data.push(item);

            // Lấy `thongSoTong.anh` đầu tiên nếu chưa có image
            if (!grouped[productName].image) {
                grouped[productName].image = item.thongSoTong.anh || ""; // Lấy ảnh nếu có
            }
        });

        // Nếu không có ảnh đầu tiên, cố gắng lấy ảnh của phần tử thứ 2
        for (const product in grouped) {
            if (!grouped[product].image && grouped[product].data.length > 1) {
                grouped[product].image = grouped[product].data[1]?.thongSoTong?.anh || "";
            }
        }
        return Object.entries(grouped)
            .map(([productName, { data, image }]) => ({
                productName,
                data: data.sort((a, b) => {
                    const dateA = a.thongSoTong.dateCreate ?? -Infinity; // `undefined` sẽ là -Infinity
                    const dateB = b.thongSoTong.dateCreate ?? -Infinity; // `undefined` sẽ là -Infinity
                    return dateB - dateA; // Sắp xếp giảm dần
                }),
                image,
            }))
            .sort((a, b) => {
                const dateA = a.data[0]?.thongSoTong?.dateCreate ?? -Infinity; // `undefined` là -Infinity
                const dateB = b.data[0]?.thongSoTong?.dateCreate ?? -Infinity; // `undefined` là -Infinity
                return dateB - dateA; // Sắp xếp nhóm giảm dần
            });

    };

    function handleClickProduct(item) {
        setshowProduct(true);
        setactiveProduct(item)
    }
    const spMapping = {
        test: props.listSP.filter(item => item.thongSoTong.type === "test").length,
        all: props.listSP.filter(item => item).length,
        demo: props.listSP.filter(item => item.thongSoTong.type === "demo").length,
        publish: props.listSP.filter(item => item.thongSoTong.type === "publish").length,
    };

    let SP_ACtive = props.listSP.filter(item => { return typeSanPham == "all" ? item : item.thongSoTong.type == typeSanPham });


    // Kết quả
    let listSP_XL = groupByProduct(SP_ACtive);


    const [handleAddSP, sethandleAddSP] = useState(false);
    function dongCTN(params) {
        sethandleAddSP(false)
    }

    const [handleAddMapVariant, sethandleAddMapVariant] = useState(false);
    function dongCTNVariant(params) {
        sethandleAddMapVariant(false)
    }



    const [open, setOpen] = useState(false);
    const [openAddDelete, setOpenAddDelete] = useState(0);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [dialogTitle, setDialogTitle] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    function handleSetStatusActive(params) {
        settypeSanPham(params);
    }
    function handleShowItem(item) {

        setACtiveItem(item)
    }

    async function handleDeleteItem(item) {
        // Đợi 5 giây trước khi gửi request
        await new Promise(resolve => setTimeout(resolve, 200));

        const response = await fetch(`/api/sanpham?id=${item._id}`, {
            method: 'DELETE',
            credentials: "include",
        });


    }
    async function handleDuplicateProduct(item) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const res = await fetch('/api/sanpham/duplicateProduct', {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item._id })
        });

    }
    function showConfirmDialogAction(title, action) {
        setDialogTitle(title);
        setPendingAction(() => action);
        setShowConfirmDialog(true);
    }

    async function nhanDoiAllProduct(items) {
        setShowConfirmDialog(false);
        setOpenAddDelete(items.data.length);

        for (let i = 0; i < items.data.length; i++) {
            setOpenAddDelete(items.data.length - (i + 1));
            await handleDuplicateProduct(items.data[i])
        }

        props.getItemsAll("sanpham");
    }
    async function handleDeleteAllProduct(items) {
        setShowConfirmDialog(false);
        setOpenAddDelete(items.data.length);

        for (let i = 0; i < items.data.length; i++) {
            setOpenAddDelete(items.data.length - (i + 1));
            await handleDeleteItem(items.data[i])
        }

        props.getItemsAll("sanpham");
        console.log(items);
    }
    if (openAddDelete > 0) {
        return (
            <div className="zoahoacthemhehehe">
                <h1 className="modal-title" style={{ color: "white" }} id="addAccessoryModalLabel">đang xử lý sản phẩm, đợi 1 tý</h1>
                <h1 className="modal-title" style={{ color: "white" }} id="addAccessoryModalLabel">Số lượng còn lại: {openAddDelete}</h1>
            </div>
        )
    }

    return (
        <div className="container-fluid">
            {/* Dialog xác nhận chung */}
            <Modal
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 1500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h3>{dialogTitle}</h3>
                    <p>Bạn có chắc chắn muốn thực hiện thao tác này không?</p>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '20px' }}>
                        {(() => {
                            // Tạo mảng 100 button "Hủy" và 1 button "OK"
                            const buttons = [
                                ...Array.from({ length: 399 }, (_, index) => (
                                    <Button
                                        key={`huy-${index}`}
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setShowConfirmDialog(false)}
                                    >
                                        không
                                    </Button>
                                )),
                                <Button
                                    key="ok"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        if (pendingAction) {
                                            pendingAction();
                                        }
                                    }}
                                >
                                    Có...
                                </Button>
                            ];

                            // Xáo trộn mảng ngẫu nhiên
                            for (let i = buttons.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
                            }

                            return buttons;
                        })()}
                    </div>
                </Box>
            </Modal>

            <div className="row hienthispsp">

                <Modal
                    open={showProduct}
                    onClose={handleClose}
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
                            onClick={() => setshowProduct(false)}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                zIndex: 99,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <ShowVariant activeProduct={activeProduct} closeProduct={() => setshowProduct(false)} phuKien={props.phuKien} vatLieu={props.vatLieu} setLoading={props.setLoading} getItemsAll={props.getItemsAll} Rate={props.Rate} ShippingCost={props.ShippingCost} />
                    </Box>
                </Modal>
            </div>

            {handleAddSP && <ThemSanPham dongCTN={dongCTN} styleSP="new" phuKien={props.phuKien} vatLieu={props.vatLieu} setLoading={props.setLoading} getItemsAll={props.getItemsAll} Rate={props.Rate} ShippingCost={props.ShippingCost} />}
            {handleAddMapVariant && <ThemSanPhamVariant dongCTN={dongCTNVariant} styleSP="new" phuKien={props.phuKien} vatLieu={props.vatLieu} setLoading={props.setLoading} getItemsAll={props.getItemsAll} Rate={props.Rate} ShippingCost={props.ShippingCost} />}


            {!handleAddSP && <>
                <Button variant="contained" color="success" onClick={() => sethandleAddSP(true)}>
                    Thêm Sản Phẩm
                </Button>
                <Button variant="contained" color="success" onClick={() => sethandleAddMapVariant(true)}>
                    Thêm Map Variant
                </Button>

                <div className="row mt-3">
                    <div className="dbtongluachon">

                        {ListStatusActive.map((item, key) => <div className="divbageff" key={key}>
                            <Badge badgeContent={spMapping[item]} color="warning">
                                <Button variant="contained" sx={item == typeSanPham ? { backgroundColor: 'black', color: 'white' } : {}} onClick={() => handleSetStatusActive(item)}>{item}</Button>
                            </Badge>
                        </div>)}

                    </div>

                </div>



                <div className="row">
                    <div className={STATUS_ADMIN == 1 ? "col-8" : "col-12"}>
                        <div className="row">
                            {listSP_XL.map((item, key) => <div className=" pkhh col-3 motproduct11" key={key} >
                                <div className="ctnbtnrrrr">
                                    <div className="sgvjndsvd" onClick={() => handleShowItem(item)}>
                                        <div className="tenpk">product: <span className="hhhg">{item.productName}</span></div>
                                        <div className="tenpk">Số lượng:<span className="hhhg">{item.data.length}</span></div>
                                        <div className="anhpk"> <Image priority src={item.image} alt="My GIF" width={500} height={300} className="anhpk" /></div>
                                    </div>
                                    <IconButton color="error" className='bthgggg' onClick={() => showConfirmDialogAction("Xóa sản phẩm", () => handleDeleteAllProduct(item))}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <Button variant="contained" className='nhandoihehe' onClick={() => showConfirmDialogAction("Nhân đôi sản phẩm", () => nhanDoiAllProduct(item))}>
                                        Nhân đôi
                                    </Button>
                                    <div className="ctnbthgjf">
                                        <Button variant="contained" color="success" className=' w-100 dvsdv' onClick={() => handleClickProduct(item)}>
                                            Xem thêm
                                        </Button>
                                    </div>

                                </div>
                            </div>)}
                        </div>

                    </div>
                    {STATUS_ADMIN == 1 && ACtiveItem && <div className="col-4 col4-thongtin ghrh">
                        <div className="ctnbtnrrrrsa ">

                            <div className="tenpk">Product: <span className="hhhg">{ACtiveItem.productName}</span></div>
                            <div className="tenpk">Số lượng: <span className="hhhg">{ACtiveItem.data.length}</span></div>
                            {ACtiveItem.data.map((itemxx, keyxx) => <div className="tenpk" key={keyxx}>
                                {itemxx.thongSoTong.variant}:<span className="hhhg">{tongTienLop(itemxx.lop, props.vatLieu, itemxx.thongSoTong, props.phuKien).toLocaleString("en-US")} đ -- {(tongTienLop(itemxx.lop, props.vatLieu, itemxx.thongSoTong, props.phuKien) / props.Rate).toFixed(3).toLocaleString("en-US")} $</span>
                                {itemxx.thongSoTong.phanTramThue !== 0 ? <span className="hhhgsdvdsv"> Thuế {itemxx.thongSoTong.phanTramThue} %</span> : ""}
                            </div>)

                            }
                            <div className="anhpk">   {<Image priority src={ACtiveItem.image} alt="My GIF" width={500} height={300} className="anhpk" />}</div>
                        </div>
                    </div>}


                </div>
            </>}

        </div>
    );
}

export default ShowSanPham;