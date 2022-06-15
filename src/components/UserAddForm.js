import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { dbService } from "../fbase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import moment from "moment";

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

const FlexBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    & > p {
        margin: 0 10px 0 25px;
        
        font-size: 18px;
    }
`;

const DatePickerBox = styled.div`
    & input {
        border: 1px solid #dadada;
        border-radius: 5px;

        padding: 10px;
        margin-right: 10px;

        &:focus {
            outline: none;
        }
    }
`;

const FormArea = styled.div`
    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;

    padding: 20px 0;
`;

const UserAddForm = () => {
    // const date = moment().format("YYYY-MM-DD");

    // 신규 등록 관련 state
    const [name, setName] = useState("");
    const [root, setRoot] = useState("부대홍보글(인벤)");
    const [partner, setPartner] = useState("");
    const [etc, setEtc] = useState("");
    const [rank, setRank] = useState("5.아기냥이");
    const [date, setDate] = useState(new Date());

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
            regist_date: moment(date).format("YYYY-MM-DD"),
            regist_root: root,
            partner: partner,
            etc: etc,
            rank: rank,
            status: "정상",
            reason: "",
        };

        await addDoc(collection(dbService, "users"), userDataObj);

        setName("");
        setPartner("");
        setEtc("");
    };


    return (
        <FormArea>
            <form onSubmit={onSubmit}>
                <FlexBox>
                    <p>이름</p>
                    <Input type="text" name="name" value={name} onChange={onChange} placeholder="이름" autoComplete='off' />

                    
                    <p>가입일</p>
                    <DatePickerBox>
                        <DatePicker
                            selected={date}
                            onChange={(date) => setDate(date)}
                            locale={ko}
                            dateFormat="yyyy-MM-dd"
                        />
                    </DatePickerBox>
                    
                    <p>가입경로</p>
                    <Select name="rootSelect" value={root} onChange={onChange}>
                        {rootSelect.map((data, index) => (
                            <option key={index} value={data}>
                                {data}
                            </option>
                        ))}
                    </Select>

                    <p>지인</p>
                    <Input type="text" name="partner" value={partner} onChange={onChange} placeholder="지인" autoComplete='off' />

                    <p>비고</p>
                    <Input type="text" name="etc" value={etc} onChange={onChange} placeholder="비고" autoComplete='off' />

                    <p>계급</p>
                    <Select name="rankSelect" value={rank} onChange={onChange}>
                        {rankSelect.map((data, index) => (
                            <option key={index} value={data}>
                                {data}
                            </option>
                        ))}
                    </Select>

                    <Button>등록</Button>
                </FlexBox>
            </form>
        </FormArea>
    );
};

export default UserAddForm;