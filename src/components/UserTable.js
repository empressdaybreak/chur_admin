import React, { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { dbService } from "../fbase";
import moment from "moment";
import "moment/locale/ko";
import styled from "styled-components";

const UserTableStyle = styled.table`
    text-align: center;
    width: 100%;
    border-collapse: collapse;

    & tbody tr {
        border: 1px solid #dadada;

        & td {
            padding: 1rem;
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
        padding: 15px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        box-sizing: border-box;
        
        & > p {
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            margin: 0;
            font-weight: bold;
            font-size: 20px;
        }

        & > span {
            font-size: 18px;
        }
    }
`;

const ModalButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & > button {
        border: none;
        border-radius: 5px;

        color: #fff;

        padding: 5px 10px;
    }

    & > button:first-child {
        background-color: red;
    }

    & > button:last-child {
        background-color: orange;
    }
`;

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

const ActiveStatus = styled.span`
    height: 10px;
    width: 10px;

    border-radius: 10px;

    margin-right: 5px;
    
    display: inline-block;
`;

const UserTable = ({ columns, statusProp }) => {
    const date = moment().format("YYYY-MM-DD");
    const day = "";

    // 신규 등록 관련 state
    const [name, setName] = useState("");
    const [root, setRoot] = useState("부대홍보글(인벤)");
    const [partner, setPartner] = useState("");
    const [etc, setEtc] = useState("");
    const [rank, setRank] = useState("5.아기냥이");
    const [data, setData] = useState([]);
    const [reason, setReason] = useState("");

    // 수정 관련 state
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState();
    const [newRoot, setNewRoot] = useState();
    const [newPartner, setNewPartner] = useState();
    const [newEtc, setNewEtc] = useState();
    const [newRank, setNewRank] = useState();

    // Modal 관련 state
    const [withdrawalToggle, setWithdrawalToggle] = useState(false);
    const [selectData, setSelectData] = useState("");

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
        } else if (name === "reason") {
            setReason(value);
        } else if (name === "NewName") {
            setNewName(value);
        } else if (name === "NewRootSelect") {
            setNewRoot(value);
        } else if (name === "NewPartner") {
            setNewPartner(value);
        } else if (name === "NewEtc") {
            setNewEtc(value);
        } else if (name === "NewRankSelect") {
            setNewRank(value);
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

    const onWithdrawalClick = async (data, value) => {
        setWithdrawalToggle(true);
        setSelectData(data);

        if (withdrawalToggle === true) {
            if (reason === "" && value === "정상") {
                alert("탈퇴 사유를 입력해주세요.");
                return false;
            }

            setWithdrawalToggle(false);

            if (value === "정상") {
                await updateDoc(doc(dbService, "users", data.id), {
                    status: "탈퇴",
                    reason: reason,
                });
            } else if (value === "탈퇴") {
                await updateDoc(doc(dbService, "users", data.id), {
                    status: "정상",
                    reason: "",
                });
            }

            setReason("");
        }
    };

    const toggleEditing = () => {
        setEditing((prev) => !prev);
    }

    useEffect(() => {
        const q = query(collection(dbService, "users"), where("status", "==", statusProp), orderBy("rank"));

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
                    <tr style={{ height: "40px" }}>
                        {columns.map((column, index) => (
                            <th key={index} width={column.Width}>
                                {column.Header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((data, index) => (
                        <tr key={data.id}>

                            {editing ? (
                                <>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Input
                                            type="text"
                                            name="NewName"
                                            value={data.name}
                                            onChange={onChange}
                                            placeholder="이름"
                                            autoComplete='off' />
                                    </td>
                                    <td>{data.regist_date}</td>
                                    <td>{moment(date).diff(moment(`${data.regist_date}`), "days")}일</td>
                                    <td>
                                        <Select name="rootSelect" value={newRoot} onChange={onChange}>
                                            {rootSelect.map((data, index) => (
                                                <option key={index} value={data}>
                                                    {data}
                                                </option>
                                            ))}
                                        </Select>
                                    </td>
                                    <td>
                                        <Input
                                            type="text"
                                            name="NewPartner"
                                            value={data.partner}
                                            onChange={onChange}
                                            placeholder="지인"
                                            autoComplete='off' />
                                    </td>
                                    <td>
                                        <Input
                                            type="text"
                                            name="NewEtc"
                                            value={data.etc}
                                            onChange={onChange}
                                            placeholder="비고"
                                            autoComplete='off' />
                                    </td>
                                    <td></td>
                                    <td>
                                        <ActiveStatus style={{ backgroundColor: data.status === "정상" ? "#28a745" : "#dc3545" }} />
                                        {data.status}
                                    </td>
                                    <ButtonCell>
                                        <button onClick={toggleEditing}>수정</button>
                                        <button onClick={toggleEditing}>취소</button>
                                    </ButtonCell>
                                </>
                            ) : (
                                <>
                                    <td>{index + 1}</td>
                                    <td>{data.name}</td>
                                    <td>{data.regist_date}</td>
                                    <td>{moment(date).diff(moment(`${data.regist_date}`), "days")}일</td>
                                    <td>{data.regist_root}</td>
                                    <td>{data.partner}</td>
                                    <td>{data.etc}</td>
                                    <td>{data.rank}</td>
                                
                                    <td>
                                        <ActiveStatus style={{ backgroundColor: data.status === "정상" ? "#28a745" : "#dc3545" }} />
                                        {data.status}
                                    </td>

                                    {statusProp === "정상" ? (
                                        <ButtonCell>
                                            <button onClick={toggleEditing}>수정</button>
                                            <button onClick={() => onWithdrawalClick(data, statusProp)}>탈퇴</button>
                                            <button onClick={() => onDeleteClick(data.id)}>삭제</button>
                                        </ButtonCell>
                                    ) : (
                                        <>
                                            <td>{data.reason}</td>
                                            
                                            <ButtonCell>
                                                <button onClick={() => onWithdrawalClick(data, statusProp)}>복구</button>
                                                <button onClick={() => onDeleteClick(data.id)}>삭제</button>
                                            </ButtonCell>
                                        </>
                                    )}
                                </>
                            )}

                        </tr>
                    ))}
                </tbody>
            </UserTableStyle>

            {statusProp === "정상" &&
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
            }

            {/* 버튼 눌렀을 때 나오는 모달 부분 */}
            {withdrawalToggle &&
                <ModalAlert>
                    <div>
                        <p>알림</p>
                        <span>{statusProp === "정상" ? "탈퇴 사유를 적어주세요." : "복구 할까요?"}</span>
                        {statusProp === "정상" &&
                            <input type="text" name="reason" onChange={onChange} value={reason} placeholder="탈퇴 사유" />
                        }

                        <ModalButtonContainer>
                            <button onClick={() => onWithdrawalClick(selectData, statusProp)}>{statusProp === "정상" ? "탈퇴" : "복구"}</button>
                            <button onClick={() => setWithdrawalToggle(false)}>취소</button>
                        </ModalButtonContainer>
                    </div>
                </ModalAlert>
            }
        </>
    );
};

export default UserTable;