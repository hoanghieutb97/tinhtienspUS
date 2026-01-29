import React, { useState } from 'react';

import { Typography } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
function ModalThemPK(props) {
    let typeLink = props.typeLink;
    const [item, setitem] = useState(props.item);
console.log("item", item);


    function setValueItem(target, value) {

        let itemxx = { ...item };
        itemxx[target] = value;
        setitem(itemxx)

    }

    console.log("typeLink", typeLink);



    const handleImageUpload = async (file) => {
        try {

            const response = await fetch("/api/cloudinary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ base64File: item.image }),
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
    const handleChonAnh = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);

            // Chuyển đổi ảnh sang Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setValueItem("image", base64String)

            };
            reader.readAsDataURL(file); // Đọc file dưới dạng Data URL (Base64)

        }
        else {

            setValueItem("image", null)
            console.log("ko chon duoc anh");

        }
    };

    const handleSubmit = async () => {


        props.setLoadingALL(true); // Bắt đầu trạng thái loading
        try {


            let response;
            if (item._id == null) {
                if (!item.name || !item.price || !item.note || !item.canNang || !item.image) {
                    alert("Vui lòng nhập đầy đủ thông tin!");
                    props.setLoadingALL(false);
                    return;
                }
                // Upload ảnh
                let imageUrl = ""
                if (item.image) {
                    imageUrl = await handleImageUpload(item.image);
                    if (!imageUrl) {
                        props.setLoadingALL(false);
                        return;
                    }
                }
                let { image, ...updateFields } = item;
                response = await fetch("/api/" + typeLink, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        ...updateFields,
                        imageUrl: imageUrl,
                        dateCreate: Date.now(),
                        nameCode: item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
                    }),
                });
            }


            else {
                let { _id, image, ...updateFields } = item;
                response = await fetch("/api/" + typeLink, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        id: item._id, // ID tài liệu bạn muốn sửa
                        updateData: {
                            ...updateFields,
                            dateCreate: Date.now(),
                            imageUrl: (item.image == null) ? item.imageUrl : imageUrl,
                            nameCode: item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-zA-Z0-9]/g, "").toLowerCase()

                        }
                    }), // Gửi dữ liệu PUT
                });
            }


            const result = await response.json();

            if (response.ok) {

                props.getItemsAll(typeLink);
            } else {
                alert(`Có lỗi xảy ra: ${result.error}`);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Không thể thêm phụ kiện!");
        } finally {


        }
    };


    async function xoaSanPham(params) {
        try {
            props.setLoadingALL(true);
            const response = await fetch(`/api/${typeLink}?id=${item._id}`, {
                method: 'DELETE',
                credentials: "include",
            });

            const result = await response.json();

            if (result.success) {

            } else {
                console.error("Lỗi khi xóa:", result.error);
            }

        } catch (error) {
            console.error("Lỗi hệ thống:", error);
        }
        finally {
            props.getItemsAll();
        }
    }
    return (
        <div
            className={`modal fade ${props.isModalOpen ? "show d-block" : ""}`}
            id="addAccessoryModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="addAccessoryModalLabel"
            // aria-hidden="true"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addAccessoryModalLabel">
                            Thêm phụ kiện mới
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => props.handlesetIsModalOpen(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* Form thêm phụ kiện */}
                        <div className="mb-3">
                            <TextField
                                label="Tên SP"
                                type="text"

                                value={item.name}
                                onChange={(e) => setValueItem("name", e.target.value)}
                                variant="outlined"
                                fullWidth
                            />

                        </div>
                        <div className="mb-3">
                            <TextField
                                label="Giá Tiền"
                                type="number"
                                minRows={4}
                                value={item.price}
                                onChange={(e) => setValueItem("price", e.target.value)}
                                variant="outlined"
                                fullWidth
                            />

                        </div>
                        <div className="mb-3">
                            <TextField
                                label="Cân nặng"
                                type="number"
                                minRows={4}
                                value={item.canNang}
                                onChange={(e) => setValueItem("canNang", e.target.value)}
                                variant="outlined"
                                fullWidth
                            />

                        </div>

                        <div className="mb-3">

                            <TextField
                                label="Note"
                                multiline
                                minRows={4}
                                value={item.note}
                                onChange={(e) => setValueItem("note", e.target.value)}
                                variant="outlined"
                                fullWidth
                            />

                        </div>
                        <div className="mb-3">

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

                                {item.image && (
                                    <div className="anhtailen">
                                        <img src={item.image} alt="Uploaded" className='amttt' />
                                    </div>

                                )}
                                {(!item.image) ? item.imageUrl && (
                                    <div className="anhtailen">
                                        <img src={item.imageUrl} alt="Uploaded" className='amttt' />
                                    </div>

                                ) : ""}
                            </Box>
                        </div>

                    </div>
                    <div className="modal-footer">
                        {/* <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={xoaSanPham}
                        >
                            Xóa
                        </button> */}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => props.handlesetIsModalOpen(false)}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}

                        >
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ModalThemPK;