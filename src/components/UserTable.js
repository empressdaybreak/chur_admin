import React, { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { dbService } from "../fbase";
import moment from "moment";
import "moment/locale/ko";
import styled from "styled-components";

const UserTableStyle = styled.table`
    text-align: center;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;

    width: 100%;
    border-collapse: collapse;

    & tbody tr {
        height: 60px;

        &:not(:last-child) {
            border-bottom: 1px solid #000;
        }
    }
`;

const ButtonCell = styled.td`
    & button {
        border-radius: 5px;
        color: #fff;
        padding: 5px 10px;
        border: none;
    }

    & button:first-child {
        background-color: skyblue;    
    }

    & button:nth-child(2) {
        background-color: red;
        margin: 0 5px;
    }

    & button:last-child {
        background-color: orange;
    }
`;

const ModalAlert = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);

    position: fixed;
    left: 0;
    top: 0;

    & > div {
        width: 300px;
        height: 200px;
        background: #fff;
        
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -150px;
        margin-top: -100px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        padding: 15px;
        box-sizing: border-box;
        
        & > p {
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
        }
    }
`;

const ModalButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & > button {
        border-radius: 5px;
        color: #fff;
        padding: 5px 10px;
        border: none;
    }

    & > button:first-child {
        background-color: red;
    }

    & > button:last-child {
        background-color: orange;
    }
`;

const UserTable = ({ columns, statusProp }) => { 
    const date = moment().format("YYYY-MM-DD");
    const day = ""; 

    const [name, setName] = useState("");
    const [root, setRoot] = useState("인벤");
    const [partner, setPartner] = useState("");
    const [etc, setEtc] = useState("");
    const [rank, setRank] = useState("아기냥이");
    const [data, setData] = useState([]);
    const [reason, setReason] = useState("");

    const [withdrawalToggle, setWithdrawalToggle] = useState(false);

    const rootSelect = ["인벤", "공홈", "지인"];
    const rankSelect = ["킹냥이", "집냥이", "뚱냥이", "아기냥이"];    

    const onChange = (event) => {
        const { target: { value, name } } = event;

        if (name === "name") {
            setName(value);
        }  else if (name === "rootSelect") {
            setRoot(value);
        } else if (name === "partner") {
            setPartner(value);
        } else if (name === "etc") {
            setEtc(value);
        } else if (name === "rankSelect") {
            setRank(value);
        } else if (name === "reason") {
            setReason(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const userDataObj = {
            name: name,
            regist_date: date,
            regist_day: day,
            regist_root: root,
            partner: partner,
            etc: etc,
            rank: rank,
            reason: reason,
            status: "정상",
        };

        await addDoc(collection(dbService, "users"), userDataObj);

        setName("");
        setPartner("");
        setEtc("");
    };

    const onDeleteClick = async (id) => {
        const ok = window.confirm("삭제하시겠습니까?");

        if (ok) {
            await deleteDoc(doc(dbService, "users", id));
        }
    };

    const onWithdrawalClick = async (data) => {
        if (reason === "" && data.status === "정상") {
            alert("탈퇴 사유를 입력해주세요.");
            return false;
        }
        setWithdrawalToggle(false);

        if (data.status === "정상") {
            await updateDoc(doc(dbService, "users", data.id), {
                status: "탈퇴",
                reason: reason,
            });            
        } else if (data.status === "탈퇴") {
            await updateDoc(doc(dbService, "users", data.id), {
                status: "정상",
                reason: "",
            });
        }

        setReason("");
    };

    useEffect(() => {
        const q = query(collection(dbService, "users"), where("status", "==", statusProp));

        onSnapshot(q, (querySnapshot) => {
            const userArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(userArray);
        });
    }, []);

    return (
        <>
            <UserTableStyle>
                <thead>
                    <tr style={{borderBottom: "1px solid #000", height: "40px"}}>
                        {columns.map((column, index) => (
                            <th key={index} width={ column.Width }>
                                { column.Header }
                            </th>  
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((data, index) => (
                        <tr key={index}>
                            <td>{ index + 1 }</td>
                            <td>{ data.name }</td>
                            <td>{ data.regist_date }</td>
                            <td>{ moment(date).diff(moment(`${data.regist_date}`), "days") }</td>
                            <td>{ data.regist_root }</td>
                            <td>{ data.partner }</td>
                            <td>{ data.etc }</td>
                            <td>{ data.rank }</td>
                            
                            { statusProp === "정상" ? (
                                <ButtonCell>
                                    <button>수정</button>
                                    <button onClick={() => setWithdrawalToggle(true)}>탈퇴</button>
                                    <button onClick={() => onDeleteClick(data.id)}>삭제</button>
                                </ButtonCell>
                            ) : (
                                <>
                                    <td>{data.reason}</td> 
                                        
                                    <ButtonCell>
                                        <button onClick={() => setWithdrawalToggle(true)}>복구</button>
                                        <button onClick={() => onDeleteClick(data.id)}>삭제</button>
                                    </ButtonCell>
                                </>
                            )}    
                            <td>{data.status}</td>
                            
                            {withdrawalToggle && 
                                <ModalAlert>
                                    <div>
                                        <p>알림</p>
                                        <span>{statusProp === "정상" ? "탈퇴" : "복구"}처리 하시겠습니까?</span>
                                        {statusProp === "정상" &&
                                            <input type="text" name="reason" onChange={onChange} value={reason} placeholder="탈퇴 사유" />
                                        }

                                        <ModalButtonContainer>
                                            <button onClick={() => onWithdrawalClick(data)}>{ statusProp === "정상" ? "탈퇴" : "복구" }</button>
                                            <button onClick={() => setWithdrawalToggle(false)}>취소</button>
                                        </ModalButtonContainer>
                                    </div>
                                </ModalAlert>
                            }
                        </tr>
                    )) }
                </tbody>
            </UserTableStyle>

            {statusProp === "정상" &&
                <form onSubmit={onSubmit}>
                    <input type="text" name="name" value={name} onChange={onChange} placeholder="이름" />

                    <select name="rootSelect" value={root} onChange={onChange}>
                        {rootSelect.map((data, index) => (
                            <option key={index} value={data}>
                                {data}
                            </option>
                        ))}
                    </select>

                    <input type="text" name="partner" value={partner} onChange={onChange} placeholder="지인" />
                    <input type="text" name="etc" value={etc} onChange={onChange} placeholder="비고" />

                    <select name="rankSelect" value={rank} onChange={onChange}>
                        {rankSelect.map((data, index) => (
                            <option key={index} value={data}>
                                {data}
                            </option>
                        ))}
                    </select>

                    <input type="submit" value="등록" />
                </form>
            }
        </>
    );
};

export default UserTable;