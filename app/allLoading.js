'use client';
import { useState } from "react";
import RingLoader from "react-spinners/RingLoader";

function AllLoading(props) {



    return (
        <div className="sdvdsvsdvsdlaoding">
            <div className="">
                <RingLoader color="#0d6efd" loading={true} size={80} />
                <div>Đang tải dữ liệu...</div>
            </div>

        </div>
    );
}

export default AllLoading;