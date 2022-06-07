import React, { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { dbService } from "../fbase";
import moment from "moment";
import "moment/locale/ko";

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
        let statusOk = "";

        if (data.status === "정상") {
            statusOk = "탈퇴";
        } else if (data.status === "탈퇴") {
            statusOk = "복구";
        }

        const ok = window.confirm(statusOk + " 처리 하시겠습니까?");

        if (ok) {
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
        }
    }

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
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>
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
                            
                            {statusProp === "정상" ? (
                                <td><input type="text" name="reason" onChange={onChange} value={ reason } placeholder="탈퇴사유" /></td>
                            ) : (
                                <td>{ data.reason }</td>
                            )}

                            <td>
                                <button>수정</button>
                                { data.status === "탈퇴" ? (
                                    <button onClick={() => onWithdrawalClick(data)}>복구</button>
                                ) : (
                                    <button onClick={() => onWithdrawalClick(data)}>탈퇴</button>
                                ) }
                                <button onClick={() => onDeleteClick(data.id)}>삭제</button>
                            </td>

                            <td>{ data.status }</td>
                        </tr>
                    )) }
                </tbody>
            </table>

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