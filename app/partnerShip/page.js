
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/Delete';
import { get_ShipingCost } from "@/lib/utils";

const _id = process.env.NEXT_PUBLIC_ID_PARTNERSHIP;

function page(props) {
  const defaultValue = {
    weight: 0,
    partner: 0
  }
  const [ItemsCost, setItemsCost] = useState([defaultValue]);
  useEffect(() => {
    async function getitems() {
      let items = await get_ShipingCost();
      setItemsCost(items)
    }
    getitems();
  }, []);



  async function Put_Cost() {
    try {
      await axios.put("/api/partnerShip", {
        id: _id,
        updateData: {
          items: ItemsCost
        }
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      let items = await get_ShipingCost();
      setItemsCost(items)

    } catch (error) {
      setItemsCost([defaultValue]); // Reset dữ liệu khi có lỗi
      console.error("Lỗi:", error.response?.data || error.message);
    }



  }


  function handleChangeItems(value, key, type) {
    let items = [...ItemsCost];
    items[key] = { ...items[key], [type]: value }; // Cập nhật giá trị đúng cách
    setItemsCost(items);
  }
  function handleThemVariant() {
    let items = [...ItemsCost];
    items.push(defaultValue)
    setItemsCost(items)
  }
  function xoaVariant(key) {
    let items = [...ItemsCost];
    let newArr = items.filter((_, index) => index !== key);

    setItemsCost(newArr);
  }

  console.log(ItemsCost);

  return (
    <div>
      <div className="col-12">
        giá cost
        {ItemsCost.map((item, key) => <div className="row" key={key}>
          <div className="col-2" >
            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
              <TextField id="outlined-basic" label={"Weight"} variant="outlined" type="number" size="small"
                value={item.weight}
                onChange={(e) => handleChangeItems(e.target.value, key, "weight")}
                placeholder="Nhập số"
                slotProps={{ input: { endAdornment: <InputAdornment position="end">gam</InputAdornment>, }, }}
              />
            </Box>
          </div>


          <div className="col-2">
            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
              <TextField id="outlined-basic" label={"partner"} variant="outlined" type="number" size="small"
                value={item.partner}
                onChange={(e) => handleChangeItems(e.target.value, key, "partner")}
                placeholder="Nhập số"
                slotProps={{ input: { endAdornment: <InputAdornment position="end">$</InputAdornment>, }, }}
              />
            </Box>
          </div>
          <div className="col-1">

            <DeleteIcon onClick={() => xoaVariant(key)} />

          </div>

        </div>)}
      </div>
      <Button variant="contained" onClick={handleThemVariant}>
        thêm variant
      </Button>
      <Button variant="contained" onClick={Put_Cost}>
        Sửa
      </Button>

    </div >

  );


}

export default page;