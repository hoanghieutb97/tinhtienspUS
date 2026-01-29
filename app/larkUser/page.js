
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MenuItem, Select, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
function page(props) {
  const [MemBers, setMemBers] = useState([]);
  let congDoan = [{
    type: "demo",
    value: []
  }, {
    type: "test",
    value: []
  }, {
    type: "publish",
    value: []
  }]
  const [UserCongDoan, setUserCongDoan] = useState([]);

  const [selectedValue, setSelectedValue] = useState(""); // Giá trị được chọn
  useEffect(() => {
    axios.get("/api/lark/getUserChat", {
      withCredentials: true, // ✅ tương đương "credentials: include"
    })
      .then(response => {
        // Xử lý kết quả thành công
        let items = response.data.data.map(item => ({ member_id: item.member_id, nameUser: item.name }));
        setMemBers(items)
      })
      .catch(error => {
        // Xử lý lỗi
        console.error('Lỗi:', error.response?.data || error.message);
      });


    axios.get("/api/larkUser", {
      withCredentials: true, // ✅ tương đương "credentials: include"
    })
      .then(response => {
        // Xử lý kết quả thành công
        let items = response.data.data[0].data
        setUserCongDoan(items)
      })
      .catch(error => {
        // Xử lý lỗi
        setUserCongDoan(congDoan)
        console.error('Lỗi:', error.response?.data || error.message);
      });
  }, []);


  async function Put_MongoDB_UserCongDoan(items) {
    let response = await fetch("/api/larkUser", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: process.env.NEXT_PUBLIC_MONGODB_ID_LARKUSER, // ID tài liệu bạn muốn sửa
        updateData: {
          data: items
        }
      }), // Gửi dữ liệu PUT
    });
    return response
  }

  async function Get_MongoDB_UserCongDoan() {

    let items = axios.get("/api/larkUser", {
      withCredentials: true, // ✅ tương đương "credentials: include"
    })
      .then(response => {
        setUserCongDoan(response.data.data[0].data)
      })
      .catch(error => {
        setUserCongDoan(congDoan)
        console.log(error)
      });

    return items
  }


  const handleChangeUser = async (nameST, value) => {
    let itemx = [...UserCongDoan];
    for (let i = 0; i < itemx.length; i++) {
      if (itemx[i].type == nameST) {
        let userx = MemBers.filter(itemk => itemk.member_id == value)
        if (itemx[i].value.filter(itemxa => itemxa.member_id == value).length == 0)
          itemx[i].value = [...itemx[i].value, ...userx]

      }

    }
    let noneData = await Put_MongoDB_UserCongDoan(UserCongDoan);
    let FetchItems = await Get_MongoDB_UserCongDoan();


  };

  const handleClear = async (nameST, value) => {
    let itemx = [...UserCongDoan];
    for (let i = 0; i < itemx.length; i++) {
      if (itemx[i].type == nameST) {
        itemx[i].value = itemx[i].value.filter(itemxa => itemxa.member_id != value)
      }

    }

    let noneData = await Put_MongoDB_UserCongDoan(UserCongDoan);
    let FetchItems = await Get_MongoDB_UserCongDoan();



  };



  return (
    <div>
      <div className="ctnusercvt">
        {UserCongDoan.map((item, key) => <div className="usfsdf" key={key}>
          <span className="spnamevl">{item.type}</span>
          <div className="scasaca">
            {item.value.map((itemx, keyx) => <Button onClick={() => handleClear(item.type, itemx.member_id)} variant="contained" color="secondary" size="small" key={keyx} className='mr-2'>
              {itemx.nameUser}
              <CloseIcon />
            </Button>)}

            <Select
              value={selectedValue}
              onChange={(e) => handleChangeUser(item.type, e.target.value)}
              displayEmpty
              style={{ minWidth: "150px" }}
            >
              <MenuItem value="" disabled>
                Chọn giá trị
              </MenuItem>
              {MemBers.map((itemm, keym) => <MenuItem value={itemm.member_id} key={keym}>{itemm.nameUser}</MenuItem>)}

            </Select>
          </div>
        </div>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Dropdown */}



      </div>

    </div >
  );


}

export default page;