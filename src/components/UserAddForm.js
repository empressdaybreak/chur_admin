import { addDoc, collection } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import styled from "styled-components";
import { dbService } from "../fbase";

const Input = styled.input`
    border: 1px solid #dadada;
    border-radius: 5px;

    padding: 10px;
    margin-right: 10px;

    &:focus {
        outline: none;
    }
`;

const Select = styled.select`
    border: 1px solid #dadada;
    border-radius: 5px;

    padding: 10px;
    margin-right: 10px;

    &:focus {
        outline: none;
    }
`;

const Button = styled.button`
    padding: 10px;

    border: none;
    border-radius: 5px;

    color: #fff;
    background-color: skyblue;
`;

const UserAddForm = () => {
    const date = moment().format("YYYY-MM-DD");

    // 신규 등록 관련 state
    const [name, setName] = useState("");
    const [root, setRoot] = useState("부대홍보글(인벤)");
    const [partner, setPartner] = useState("");
    const [etc, setEtc] = useState("");
    const [rank, setRank] = useState("5.아기냥이");

    // Select 항목 배열
    const rootSelect = ["부대홍보글(인벤)", "부대홍보글(공홈)", "지인초대"];
    const rankSelect = ["1.킹냥이", "2.운영냥이", "3.집냥이", "4.뚱냥이", "5.아기냥이", "6.식빵굽는중"];

    const onChange = (event) => {
        const { target: { value, name } } = event;

        if (name === "name") {
            setName(value);
        } else if (name === "rootSelect") {
            setRoot(value);
        } else if (name === "partner") {
            setPartner(value);
        } else if (name === "etc") {
            setEtc(value);
        } else if (name === "rankSelect") {
            setRank(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const userDataObj = {
            name: name,
            regist_date: date,
            regist_root: root,
            partner: partner,
            etc: etc,
            rank: rank,
            status: "정상",
        };

        await addDoc(collection(dbService, "users"), userDataObj);

        setName("");
        setPartner("");
        setEtc("");
    };


    return (
        <form onSubmit={onSubmit} style={{ marginTop: "10px" }}>
            <Input type="text" name="name" value={name} onChange={onChange} placeholder="이름" autoComplete='off' />

            <Select name="rootSelect" value={root} onChange={onChange}>
                {rootSelect.map((data, index) => (
                    <option key={index} value={data}>
                        {data}
                    </option>
                ))}
            </Select>

            <Input type="text" name="partner" value={partner} onChange={onChange} placeholder="지인" autoComplete='off' />
            <Input type="text" name="etc" value={etc} onChange={onChange} placeholder="비고" autoComplete='off' />

            <Select name="rankSelect" value={rank} onChange={onChange}>
                {rankSelect.map((data, index) => (
                    <option key={index} value={data}>
                        {data}
                    </option>
                ))}
            </Select>                   

            <Button>등록</Button>
        </form>
    );
};

export default UserAddForm;