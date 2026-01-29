'use client';
import React from 'react';
import AllLoading from "../allLoading";
import { useState, useEffect } from 'react';
import ShowSanPham from './showSanPham';
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getItemsByQuery, fetchPhuKien, fetchVatLieu, get_ShipingCost } from "@/lib/utils";
const Fuse = require('fuse.js');
function page(props) {
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const [activeItems, setactiveItems] = useState([]);
    const [phuKien, setPhuKien] = useState([]);
    const [vatLieu, setVatLieu] = useState([]);
    const [Rate, setRate] = useState(0);
    const [ShippingCost, setShippingCost] = useState([]);
    const [query, setQuery] = useState("");
    const handleChangeSearch = (event) => {
        const value = event.target.value;
        setQuery(value);

    };

    async function fetchExchangeRate() {
        try {
            const response = await fetch(
                "https://open.er-api.com/v6/latest/USD?apikey=11742cfd1de9c29694fc8053 "
            );

            if (!response.ok) {
                throw new Error("Không thể lấy dữ liệu tỷ giá.");
            }

            const data = await response.json();


            return (data.rates.VND); // Lấy tỷ giá USD → VND
        } catch (err) {
            return 0.01
        } finally {

        }
    }
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

        let rate = 26000;
        // let rate = await fetchExchangeRate();
        console.log(rate);

        setPhuKien(ItemsPK);
        setVatLieu(ItemsVL);
        setRate(rate)
        setLoading(false); // Bắt đầu trạng thái loading

    }
    async function getItemsAll(param) {
        setLoading(true); // Bắt đầu trạng thái loading
        let items = await getItemsByQuery("/" + param, "");
        items = items.filter(item => item.typeSanPham == "theu")
        setactiveItems(items);
        setQuery("")
        setLoading(false); // Bắt đầu trạng thái loading

    }
    const options = {
        keys: ['name'], // Trường cần tìm kiếm
        threshold: 0.3 // Mức độ chính xác (0 là chính xác hoàn toàn, 1 là chấp nhận sai lệch lớn)
    };

    const fuse = new Fuse(activeItems, options);
    // const searchResult = fuse.search(textSearch);
    const searchResult = query ? fuse.search(query).map(result => result.item) : activeItems; // Nếu textSearch rỗng, trả về toàn bộ mảng




    if (loading) {
        return <AllLoading />;
    }


    return (<>
        {/* {loading ? <AllLoading /> : ""} */}
        <div className='vdsdvs'>
            <div className="timkiemheh">
                <TextField
                    label="Tìm kiếm..."
                    variant="outlined"
                    fullWidth
                    sx={{
                        "& .MuiInputBase-root": {
                            height: "40px", // Chiều cao input
                        },
                    }}
                    value={query}
                    onChange={handleChangeSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>


            <ShowSanPham listSP={searchResult} phuKien={phuKien} vatLieu={vatLieu} setLoading={(param) => setLoading(param)} getItemsAll={getItemsAll} Rate={Rate} ShippingCost={ShippingCost} />

        </div>
    </>
    );

}
export default page;