import axios from "axios";
export function cal_Status(params) {

    switch (params) {
        case "admin":
            return 1
            break;
        case "pro":
            return 2
            break;
        case "kho":
            return 3
            break;
        case "taosp":
            return 4
            break;

        default: return 5
            break;
    }
}
export async function getItemsByQuery(pathname, searchText) {
    if (searchText !== "activeItemsToDedault")
        try {
            const response = await fetch("/api" + pathname + "?q=" + searchText, { cache: "no-store" });
            const data = await response.json();

            return (data?.data || [])
        } catch (error) {
            console.error("Error fetching vatlieu:", error);
            return []
        } finally {

        }
    else {
        return []
    }
}
export async function get_ShipingCost() {
    const _id = process.env.NEXT_PUBLIC_ID_PARTNERSHIP;
    let defaultValue = {
        weight: 0,
        partner: 0
    }
    let items = [];
    await axios.get("/api/partnerShip?q=" + _id, {
        withCredentials: true, // ✅ gửi cookie
    })
        .then(response => {
            items = response.data.data.items;
        })
        .catch(error => {
            items = [defaultValue]
        });

    return items
}

export function caculator_ShipingCost(ShippingCost, canTien) {
    const sortedData = [...ShippingCost].sort((a, b) => (+a.weight) - (+b.weight));

    // 2. Tìm phần tử đầu tiên có weight >= x
    const item = sortedData.find(item => item.weight >= (+canTien));

    return item ? +item.partner : 999999; // Nếu không có, trả về null

}


export const styleAdmin = async (param) => {
    let item = null;
    switch (param) {
        case "admin":
            item = 1;
            break;
        case "pro":
            item = 2;
            break;
        case "kho":
            item = 3;
            break;
        case "taosp":
            item = 4;
            break;

        default:
            item = 5;
            break;

    }
    return item
};

export const fetchPhuKien = async () => {
    try {
        const response = await fetch("/api/phukien", {
            method: "GET",
            cache: "no-store",
            credentials: "include", // ✅ gửi kèm cookie
          });
        const data = await response.json();
        return (data?.data || []);
    } catch (error) {
        console.error("Error fetching phukien:", error);
        return []
    }
    finally {

    }
};

export async function tagUserType(param) {
    try {
        let dataF = {
            ID_Messenger: param.idChat,
            userMess: await sanpham_larkUser(param.type),
            type: param.type
        };

        const response = await fetch("/api/lark/tagUserType", {
            method: "POST",
            credentials: "include", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataF),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Lỗi khi tag user");

        return true;
    } catch (error) {
        console.error("Lỗi khi tag user:", error);
        return false
    }
}

export async function putSanPham(_id, data) {
    try {
        let DataPut = {
            id: _id, // ID tài liệu bạn muốn sửa
            updateData: data
        };

        const response = await fetch("/api/sanpham", {
            method: "PUT",
            credentials: "include", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(DataPut), // Gửi dữ liệu PUT
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Lỗi khi tag user");

        return true;
    } catch (error) {
        console.error("Lỗi khi tag user:", error);
        return false
    }
}
export async function postSanPham(data) {
    try {

        const response = await fetch("/api/sanpham", {
            method: "POST",
            credentials: "include", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Lỗi khi tag user");

        return true;
    } catch (error) {
        console.error("Lỗi khi tag user:", error);
        return false
    }
}


export const fetchVatLieu = async () => {
    try {
        const response = await fetch("/api/vatlieu", {
            method: "GET",
            cache: "no-store",
            credentials: "include", // ✅ gửi kèm cookie xác thực
          });
        const data = await response.json();
        return (data?.data || []);
    } catch (error) {
        console.error("Error fetching phukien:", error);
        return []
    }
    finally {

    }
};
export async function sanpham_larkUser(type) {
    let items = await axios.get(`/api/larkUser`, {
        withCredentials: true, // ✅ gửi kèm cookie
      })
        .then(response => {
            return response.data.data[0].data
        })
        .catch(error => {
            return false
        });


    if (items) return items.filter((item => item.type == type))[0].value.map(item => item.member_id)
    return false
}
export const URL_upload_cloudinary = async (param) => {
    try {
        const response = await fetch("/api/cloudinary", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64File: param }),
        });

        const data = await response.json();
        if (data.success) {
            return data.url; // URL ảnh từ Cloudinary
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Image Upload Error:", error);
        alert("Không thể tải ảnh lên!");
        return null;
    }
};
export async function createChatLark(urlCloudinary, type, product) {
    try {
        const response = await axios.post('/api/lark/sendImage_Chat', {
            imageUrl: urlCloudinary,
            product: product,
            type: type,
            userMess: await sanpham_larkUser(type)
          }, {
            withCredentials: true // ✅ gửi kèm cookie authToken
          });
        return response.data.ID_Messenger;


    } catch (error) {

        console.error('Error posting data:', error);
        return false
    }
};
export const initialStateVL = {
    tienVatLieu: 0, // có thể chọn ngoài
    tienMuc: 0,
    tienThietke: 0,
    tienIn: 0,
    tienCat: 0,
    tienDien: 0,
    tienChietKhauMay: 0,
    tienHop: 0, // có thể chọn ngoài
    tienThungDongHang: 0,
    tienMatBang: 766,
    tienTemNhan: 400,
    TienBangDinh: 0,
    tienKeoDan: 0,
    tienXop: 0,
    tienMangBoc: 0,
    tienPhuKien: 0,
    tienDongGoi: 0
}

export function tinhTienVL(lop, vatLieu, thongSoTong, phuKien) {
    return {
        tienVatLieu: tinhTienVatLieu(lop, vatLieu),
        tienMuc: tinhTienMuc(lop, vatLieu),
        tienThietke: tinhTienTK(lop, vatLieu),
        tienIn: tinhTienIn(lop, vatLieu),
        tienDien: tinhTienDIen(lop, vatLieu),
        tienChietKhauMay: tinhTienChietKhau(lop, vatLieu),
        tienCat: tinhTienCat(lop, vatLieu),
        tienKeoDan: tinhTienKeoDan(lop, vatLieu, thongSoTong),
        tienHop: tinhTienHop(lop, vatLieu, thongSoTong),
        tienBangDinh: tinhTienBangDinh(lop, vatLieu, thongSoTong),
        tienThungDongHang: tinhTienThungDongHang(lop, vatLieu, thongSoTong),
        tienXop: tinhTienXop(lop, vatLieu, thongSoTong),
        tienMangBoc: tinhTienMangBoc(lop, vatLieu, thongSoTong),
        tienPhuKien: tinhTienPhuKien(lop, vatLieu, thongSoTong, phuKien),
        tienDongGoi: tinhTienDongGoi(lop, vatLieu, thongSoTong),
        tienMatBang: tinhTienMatBang(lop, vatLieu, thongSoTong, phuKien),

    };
}


export function tongTienLop(lop, vatLieu, thongSoTong, phuKien) {
    const calculationFunctions = {
        tienMatBang: tinhTienMatBang,
        tienTemNhan: tinhTienTemNhan,
        tienVatLieu: tinhTienVatLieu,
        tienMuc: tinhTienMuc,
        tienThietke: tinhTienTK,
        tienIn: tinhTienIn,
        tienDien: tinhTienDIen,
        tienChietKhauMay: tinhTienChietKhau,
        tienCat: tinhTienCat,
        tienKeoDan: tinhTienKeoDan,
        tienHop: tinhTienHop,
        TienBangDinh: tinhTienBangDinh,
        tienThungDongHang: tinhTienThungDongHang,
        tienXop: tinhTienXop,
        tienMangBoc: tinhTienMangBoc,
        tienPhuKien: tinhTienPhuKien,
        tienDongGoi: tinhTienDongGoi
    };

    const calculatedValues = Object.fromEntries(
        Object.entries(calculationFunctions).map(([key, func]) => [
            key,
            Math.floor(func(lop, vatLieu, thongSoTong, phuKien))
        ])
    );
    let tongTien = Object.values(calculatedValues).reduce((sum, value) => sum + value, 0)
    return tongTien * 1.1;
}
export const initialWHZ = [
    {
        nameSTT: "Chiều Ngắn Hộp",
        valueSTT: "chieuNgang",
        dv: "cm"
    },
    {
        nameSTT: "Chiều Dài Hộp",
        valueSTT: "chieuDoc",
        dv: "cm"
    },
    {
        nameSTT: "Độ Cao Hộp",
        valueSTT: "doCao",
        dv: "cm"
    },
    {
        nameSTT: "Cân Nặng Hộp",
        valueSTT: "canNang",
        dv: "gam"
    }]
export const initialVIP = [
    {
        nameSTT: "VIP 1",
        valueSTT: "vip1"
    },
    {
        nameSTT: "VIP 2",
        valueSTT: "vip2",
    },
    {
        nameSTT: "VIP 3",
        valueSTT: "vip3",
    }]


export function macdinh(lop, giaVatLieu) {
    let tongtien = 0;
    let gia = giaVatLieu.filter(item => item.nameCode == lop[i].chatLieu)[0].price;
    for (let i = 0; i < lop.length; i++) {

    }
    return tongtien
}

export function tinhTienVatLieu(lop, giaVatLieu) {
    let tongtien = 0;
    for (let i = 0; i < lop.length; i++) {
        let tenChatLieu = lop[i].chatLieu;
        if (tenChatLieu.startsWith("custom")) {
            tenChatLieu = tenChatLieu.replace(/^custom/, "").trim();


            tongtien = tongtien + (+giaVatLieu.filter(item => item._id == tenChatLieu)[0].price)



        }
        else {

            let gia = giaVatLieu.filter(item => item.nameCode == tenChatLieu)[0].price;
            gia = +gia;
            let type = tenChatLieu.slice(0, 2).toLowerCase();
            let dongia = 0
            if (type == "mi") {
                gia = gia / 3
                let chieuDai = (+ lop[i].chieuDai) * 2.54;
                let chieuRong = (+lop[i].chieuRong) * 2.54;
                let width, hight;
                if (chieuDai >= chieuRong) {
                    width = chieuDai; // Chiều dài hơn hoặc bằng
                    hight = chieuRong;
                } else {
                    width = chieuRong; // Chiều rộng hơn
                    hight = chieuDai;
                }
                let slWidth = Math.floor(121 / (width + 0.2));
                let slHight = Math.floor(81 / (hight + 0.2));
                var vlThuaW = 121 - (slWidth * (width + 0.2));
                var vlThuaH = 81 - (slHight * (hight + 0.2));
                if (vlThuaW > 10) {
                    gia = gia - gia * (vlThuaW - 10) / 121;
                }
                if (vlThuaH > 10) {
                    gia = gia - gia * (vlThuaH - 10) / 81;
                }
                dongia = Math.floor(gia / (slWidth * slHight));
            }
            else if (type = "go") {
                let width = (+ lop[i].chieuDai) * 2.54;
                let hight = (+lop[i].chieuRong) * 2.54;
                let slWidth = Math.floor(91 / (width + 0.2));
                let slHight = Math.floor(91 / (hight + 0.2));
                var vlThuaW = 91 - (slWidth * (width + 0.2));
                var vlThuaH = 91 - (slHight * (hight + 0.2));
                if (vlThuaW > 10) {
                    gia = gia - gia * (vlThuaW - 10) / 91;
                }
                if (vlThuaH > 10) {
                    gia = gia - gia * (vlThuaH - 10) / 91;
                }
                dongia = Math.floor(gia / (slWidth * slHight));
            }

            tongtien = tongtien + dongia

        }



    }
    // console.log(tongtien);

    return tongtien
}


export function tinhTienMuc(lop, giaVatLieu) {
    let tongtien = 0;


    let muc = giaVatLieu.filter(item => item.nameCode == "tienmuc")[0].price;
    let mucM2 = muc / 30;



    for (let i = 0; i < lop.length; i++) {
        let soMatIn = (lop[i].soMatIn != "false") ? lop[i].soMatIn : 0;
        let chieuDai = (+ lop[i].chieuDai) * 2.54;
        let chieuRong = (+lop[i].chieuRong) * 2.54;
        let tienmuc = soMatIn * (chieuDai * chieuRong) * mucM2 / 10000;
        tongtien = tongtien + tienmuc
    }
    return tongtien
}

export function tinhTienTK(lop, giaVatLieu) {

    let tongtien = 2500 + ((lop.length == 0) ? 0 : (lop.length - 1)) * 1000;

    return tongtien
}
export function tinhTienIn(lop, giaVatLieu) {
    let tongtien = 0;
    let gia = giaVatLieu.filter(item => item.nameCode == "luongcongnhan")[0].price;
    let tienCongPhut = gia / (24 * 8 * 60);


    for (let i = 0; i < lop.length; i++) {
        let soMatIn = (lop[i].soMatIn != "false") ? lop[i].soMatIn : 0;
        let tienin = 0
        let chieuDai = (+ lop[i].chieuDai);
        let chieuRong = (+lop[i].chieuRong);
        let maxLength = chieuDai * chieuRong;
        if (maxLength <= 25) tienin = tienCongPhut * 4
        else if (maxLength <= 400) tienin = ((maxLength / 25) * tienCongPhut * 1) + (tienCongPhut * 4);
        else tienin = ((maxLength / 25) * tienCongPhut * 0.8) + (tienCongPhut * 4);
        tienin = (soMatIn == 2 ? 1.5 : soMatIn) * tienin
        tongtien = tongtien + tienin
    }
    console.log("cũ.......", tongtien);

    return tongtien
}
export function tinhTienCat(lop, giaVatLieu) {
    let tongtien = 0;
    let gia = giaVatLieu.filter(item => item.nameCode == "luongcongnhan")[0].price;
    let tienCongPhut = gia / (24 * 8 * 60);
    for (let i = 0; i < lop.length; i++) {
        let heSoNhan = 2;
        let chatLieu = lop[i].chatLieu;



        let soMatIn = (lop[i].soMatIn != "false") ? lop[i].soMatIn : 0;
        let tienin = 0
        let chieuDai = (+ lop[i].chieuDai);
        let chieuRong = (+lop[i].chieuRong);
        let maxLength = chieuDai * chieuRong;
        if (maxLength <= 25) tienin = tienCongPhut * heSoNhan
        else if (maxLength <= 400) tienin = ((maxLength / 25) * tienCongPhut * 0.5) + (tienCongPhut * heSoNhan);
        else tienin = ((maxLength / 25) * tienCongPhut * 0.4) + (tienCongPhut * heSoNhan);
        tienin = (lop[i].catStatus == true ? 1 : 0) * tienin
        tongtien = tongtien + tienin;
        if (chatLieu.slice(-3) == "3mm") tongtien = tongtien * 1
        else if (chatLieu.slice(-4) == "15mm") tongtien = tongtien * 6.5
        else if (chatLieu.slice(-3) == "2mm") tongtien = tongtien * 0.9
        else if (chatLieu.slice(-3) == "4mm") tongtien = tongtien * 1.1
        else if (chatLieu.slice(-3) == "5mm") tongtien = tongtien * 1.2

    }
    return tongtien
}

export function tinhTienDIen(lop, giaVatLieu) {
    let tienIn = tinhTienIn(lop, giaVatLieu);
    let tienCat = tinhTienCat(lop, giaVatLieu);

    let tongtien = (tienIn + tienCat) / 5;

    return tongtien
}

export function tinhTienChietKhau(lop, giaVatLieu) {
    let tongtien = 0;
    let heSo = 1000;
    for (let i = 0; i < lop.length; i++) {
        let downTien = 0;
        let chieuDai = (+ lop[i].chieuDai);
        let chieuRong = (+lop[i].chieuRong);
        let maxLength = chieuDai * chieuRong;
        if (maxLength <= 25) downTien = heSo;
        else if (maxLength <= 400) downTien = heSo * 1.5;
        else downTien = heSo * 2.5;


        tongtien = tongtien + downTien;
    }

    return tongtien
}

export function tinhTienHop(lop, giaVatLieu, thongSoTong) {
    let tongtien = 0
    let maxW = + thongSoTong.chieuDoc;
    let maxH = +thongSoTong.chieuNgang;
    let maxZ = + thongSoTong.doCao;


    tongtien = ((maxW + maxZ * 4 + 3) * (maxZ * 4 + maxH * 2 + 3) / (100 * 100)) * 9000 * 1.2





    return tongtien
}
export function tinhTienThungDongHang(lop, giaVatLieu, thongSoTong) {


    let tienThung = (giaVatLieu.length == 0) ? 0 : + giaVatLieu.filter(item => item.nameCode == "thungdonghang505050")[0].price;


    let tongtien = 0
    function calculateBoxesInContainer(containerDimensions, boxDimensions) {
        let { length: L_thung, width: W_thung, height: H_thung } = containerDimensions;
        let { length: a, width: b, height: z } = boxDimensions;

        // Số lượng hộp theo từng chiều
        let n_x = Math.floor(L_thung / a);
        let n_y = Math.floor(W_thung / b);
        let n_z = Math.floor(H_thung / z);

        // Tổng số hộp
        return n_x * n_y * n_z;
    }

    // Ví dụ: Kích thước thùng và hộp
    let container = { length: 50, width: 50, height: 50 }; // Thùng 50x50x50 cm
    let box = { length: thongSoTong.chieuDoc, width: thongSoTong.chieuDoc, height: thongSoTong.doCao };       // Hộp 10x20x15 cm
    let totalBoxes = calculateBoxesInContainer(container, box);



    tongtien = Math.floor(tienThung / totalBoxes)



    if (tongtien == Infinity) return 0
    return tongtien
}
export function tinhTienKeoDan(lop, giaVatLieu, thongSoTong) {
    var heso = 1;


    for (let i = 0; i < lop.length; i++) {

        let chieuDai = (+ lop[i].chieuDai);
        let chieuRong = (+lop[i].chieuRong);
        let maxLength = chieuDai * chieuRong;


        heso = maxLength / 16

    }

    let tongtien = heso * ((lop.length > 1) ? ((lop.length - 1) * 150) : 0);



    return tongtien
}

export function tinhTienBangDinh(lop, giaVatLieu, thongSoTong) {



    let maxW = + thongSoTong.chieuDoc;
    let maxH = +thongSoTong.chieuNgang;

    let dientich = 2 * (maxW + maxH)
    let heso = dientich / 16
    let tongtien = heso * 50;




    return tongtien
}

export function tinhTienXop(lop, giaVatLieu, thongSoTong) {
    let activeXop = thongSoTong.xop;


    let giaVL = (giaVatLieu.length != 0) ? Math.floor(giaVatLieu.filter(item => item.nameCode == activeXop)[0].price) : 0;


    let tongtien = 0;
    let giaXopM2 = 0;
    switch (activeXop) {
        case "xop3mm":
            giaXopM2 = giaVL / (120 * 10000);
            break;
        case "xop5mm":
            giaXopM2 = giaVL / (120 * 10000);
            break;
        case "xop10mm":
            giaXopM2 = giaVL / (120 * 5000);
            break;
        case "xop20mm":
            giaXopM2 = giaVL / (120 * 2500);
            break;
        case "xopno":
            giaXopM2 = giaVL / (100 * 5000);
            break;
        case "xopmong":
            giaXopM2 = giaVL / (140 * 60000);
            break;


        default:
            break;
    }
    tongtien = Math.floor(2.5 * giaXopM2 * ((+ thongSoTong.chieuDoc) * (+thongSoTong.chieuNgang)));


    return tongtien
}

export function tinhTienMangBoc(lop, giaVatLieu, thongSoTong) {
    let activeXop = thongSoTong.xop;


    let giaVL = (giaVatLieu.length != 0) ? Math.floor(giaVatLieu.filter(item => item.nameCode == activeXop)[0].price) : 0;


    let tongtien = 0;
    let giaXopM2 = 0.5;

    tongtien = Math.floor(2.5 * giaXopM2 * ((+ thongSoTong.chieuDoc) + (+thongSoTong.chieuNgang)));

    return tongtien
}

export function tinhCanNang(lop, giaVatLieu, thongSoTong, giaPhuKien) {
    let tongCan = 0;
    // can nang vat lieu
    for (let i = 0; i < lop.length; i++) {
        let tenChatLieu = lop[i].chatLieu;
        if (tenChatLieu.startsWith("custom")) {
            tenChatLieu = tenChatLieu.replace(/^custom/, "").trim();
            tongCan = tongCan + (+(giaVatLieu.filter(item => item._id == tenChatLieu)[0].canNang));
        }


        else {
            let canVL = giaVatLieu.filter(item => item.nameCode == tenChatLieu)[0].canNang;


            canVL = +canVL;
            let type = tenChatLieu.slice(0, 2).toLowerCase();
            let can1L = 0
            if (type == "mi") {
                canVL = canVL / 3


                let width = (+ lop[i].chieuDai) * 2.54;
                let hight = (+lop[i].chieuRong) * 2.54;



                can1L = (canVL * (width * hight) / (122 * 80));





            }
            else if (type = "go") {

                let width = (+ lop[i].chieuDai) * 2.54;
                let hight = (+lop[i].chieuRong) * 2.54;



                can1L = (canVL * (width * hight) / (92 * 92));



            }

            tongCan = tongCan + can1L
        }



    }

    // can nangphukien
    for (let i = 0; i < thongSoTong.phuKien.length; i++) {

        let tenChatLieu = thongSoTong.phuKien[i];



        {
            let canVL = giaPhuKien.filter(item => item._id == tenChatLieu)[0].canNang;


            canVL = +canVL;


            tongCan = tongCan + canVL
        }



    }

    // can nang muc
    for (let i = 0; i < lop.length; i++) {
        let soMatIn = (lop[i].soMatIn != "false") ? lop[i].soMatIn : 0;
        let chieuDai = (+ lop[i].chieuDai) * 2.54;
        let chieuRong = (+lop[i].chieuRong) * 2.54;
        let canNangMuc = soMatIn * (chieuDai * chieuRong) * 33 / 10000;
        tongCan = tongCan + canNangMuc;
    }
    // can nang hop
    let x = 0.038823529
    let Whop = + thongSoTong.chieuDoc;
    let Hhop = +thongSoTong.chieuNgang;
    let Zhop = +thongSoTong.doCao;
    let kichThuocHop = 2 * (Whop * Hhop) + 3 * (Whop * Zhop) + 6 * (Zhop * Zhop) + 2 * (1.8 * Hhop * Zhop) + 4 * (Hhop * Zhop)
    tongCan = tongCan + kichThuocHop * x

    // tienxop
    let xx = 0.00897920604
    let canNangXop = 2 * (Whop * Hhop * xx);


    switch (thongSoTong.xop) {
        case "xong5mm":
            canNangXop = canNangXop = canNangXop * 1
            break;
        case "xopno":
            canNangXop = canNangXop / 4
            break;
        case "xop10mm":
            canNangXop = canNangXop * 2
            break;
        case "xop3mm":
            canNangXop = 3 * canNangXop / 5
            break;
        case "xop20mm":
            canNangXop = canNangXop * 4
            break;

        default:
            canNangXop = canNangXop / 5
            break;
    }

    tongCan = tongCan + canNangXop
    return tongCan
}
export function tinhTienPhuKien(lop, giaVatLieu, thongSoTong, giaPhuKien) {


    let activePK = thongSoTong.phuKien.map(item => {
        let arr = giaPhuKien.filter(itemPK => itemPK._id == item)

        if (arr.length == 1) return arr[0]
        return undefined;
    }).filter(item => item !== undefined)



    let tongtien = 0;
    for (let i = 0; i < activePK.length; i++) {
        tongtien = tongtien + (+activePK[i].price)

    }



    return tongtien
}

export function tinhTienDongGoi(lop, giaVatLieu, thongSoTong) {
    var heso = 1;


    for (let i = 0; i < lop.length; i++) {

        let chieuDai = (+ lop[i].chieuDai);
        let chieuRong = (+lop[i].chieuRong);
        let maxLength = chieuDai * chieuRong;


        heso = Math.sqrt(maxLength) / Math.sqrt(16)

    }

    let tongtien = heso * ((lop.length > 1) ? (3000 + (lop.length - 1) * 1000) : 3000);



    return (tongtien < 3000) ? 3000 : tongtien
}

export function tinhTienTemNhan() {

    return initialStateVL.tienTemNhan
}

export function tinhTienMatBang() {
    return initialStateVL.tienMatBang
}