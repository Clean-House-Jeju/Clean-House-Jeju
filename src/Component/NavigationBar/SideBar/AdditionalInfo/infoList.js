import WasteAppliances from "./WasteAppliances";
import React from "react";
import Dumpster from "./Dumpster";

export const list = [

    {
        id: 0,
        title: '폐가전 제품 배출 방법',
        component: <WasteAppliances/>
    },
    {
        id: 1,
        title: "대형 폐기물 배출 방법",
        component: <Dumpster/>
    }
]
