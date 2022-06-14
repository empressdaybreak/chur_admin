import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import styled from "styled-components";
import { dbService } from "../fbase";

const UserContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;

    padding: 1rem;

    &:not(:last-child) {
        margin-bottom: 15px;
    }

    & p {
        margin: 0;
        flex: 1;
    }
`;

const ActiveStatus = styled.span`
    height: 10px;
    width: 10px;

    border-radius: 10px;

    margin-right: 5px;
    
    display: inline-block;
`;

const ButtonCell = styled.div`
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

const UserList = ({ statusProp, userObj, index }) => {
    const date = moment().format("YYYY-MM-DD");

    // 수정 관련 state
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(userObj.name);
    const [newRoot, setNewRoot] = useState(userObj.regist_root);
    const [newPartner, setNewPartner] = useState(userObj.partner);
    const [newEtc, setNewEtc] = useState(userObj.etc);
    const [newRank, setNewRank] = useState(userObj.rank);
    const [newReason, setNewReason] = useState(userObj.reason);

     // Modal 관련 state
    const [withdrawalToggle, setWithdrawalToggle] = useState(false);
    
    // 탈퇴 사유 관련 state
    const [reason, setReason] = useState("");

    // Select 항목 배열
    const rootSelect = ["부대홍보글(인벤)", "부대홍보글(공홈)", "지인초대"];
    const rankSelect = ["1.킹냥이", "2.운영냥이", "3.집냥이", "4.뚱냥이", "5.아기냥이", "6.식빵굽는중"];

    const onChange = (event) => {
        const { target: { value, name } } = event;

        if (name === "NewName") {
            setNewName(value);
        } else if (name === "NewRootSelect") {
            setNewRoot(value);
        } else if (name === "NewPartner") {
            setNewPartner(value);
        } else if (name === "NewEtc") {
            setNewEtc(value);
        } else if (name === "NewRankSelect") {
            setNewRank(value);
        } else if (name === "reason") {
            setReason(value);
        } else if (name === "NewReason") {
            setNewReason(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        
        await updateDoc(doc(dbService, "users", userObj.id), {
            name: newName,
            regist_root: newRoot,
            partner: newPartner,
            etc: newEtc,
            rank: newRank,
            reason: newReason,
        });

        setEditing(false);
    };

    const onDeleteClick = async (id) => {
        const ok = window.confirm("삭제하시겠습니까?");

        if (ok) {
            await deleteDoc(doc(dbService, "users", id));
        }
    };

    const onWithdrawalClick = async (value) => {
        if (reason === "" && value === "정상") {
            alert("탈퇴 사유를 입력해주세요.");
            return false;
        }

        if (value === "정상") {
            await updateDoc(doc(dbService, "users", userObj.id), {
                status: "탈퇴",
                reason: reason,
            });
        } else if (value === "탈퇴") {
            await updateDoc(doc(dbService, "users", userObj.id), {
                status: "정상",
                reason: "",
            });
        }

        setWithdrawalToggle(false);
        setReason("");
    };

    const toggleEditing = () => {
        setEditing((prev) => !prev);
    }

    
    return (
        <>
            {editing ? (
                <form style={{ marginBottom: "15px" }} onSubmit={ onSubmit }>
                    <UserContainer>
                        <p>{index}</p>
                        <p>
                            <Input
                                type="text"
                                name="NewName"
                                value={newName}
                                onChange={onChange}
                                placeholder="이름"
                                autoComplete='off'
                            />
                        </p>
                        <p>{userObj.regist_date}</p>
                        <p>{moment(date).diff(moment(userObj.regist_date), "days")}일</p>
                        <p>
                            <Select name="NewRootSelect" value={newRoot} onChange={onChange}>
                                {rootSelect.map((data, index) => (
                                    <option key={index} value={data}>
                                        {data}
                                    </option>
                                ))}
                            </Select>
                        </p>
                        <p>
                            <Input
                                type="text"
                                name="NewPartner"
                                value={newPartner}
                                onChange={onChange}
                                placeholder="지인"
                                autoComplete='off'
                            />
                        </p>
                        <p>
                            <Input
                                type="text"
                                name="NewEtc"
                                value={newEtc}
                                onChange={onChange}
                                placeholder="비고"
                                autoComplete='off'
                            />
                        </p>
                        <p>
                            <Select name="NewRankSelect" value={newRank} onChange={onChange}>
                                {rankSelect.map((data, index) => (
                                    <option key={index} value={data}>
                                        {data}
                                    </option>
                                ))}
                            </Select>
                        </p>
                        <p>
                            <ActiveStatus style={{ backgroundColor: userObj.status === "정상" ? "#28a745" : "#dc3545" }} />
                            {userObj.status}
                        </p>

                        {userObj.status === "탈퇴" && 
                            <Input
                                type="text"
                                name="NewReason"
                                value={newReason}
                                onChange={onChange}
                                placeholder="탈퇴 사유"
                                autoComplete='off'
                            />
                        }
                        <ButtonCell>
                            <button>수정완료</button>
                            <button onClick={toggleEditing}>취소</button>
                        </ButtonCell>
                    </UserContainer>
                </form>
            ) : (
                <UserContainer>
                    <p>{index}</p>
                    <p>{userObj.name}</p>
                    <p>{userObj.regist_date}</p>
                    <p>{moment(date).diff(moment(userObj.regist_date), "days")}일</p>
                    <p>{userObj.regist_root}</p>
                    <p>{userObj.partner}</p>
                    <p>{userObj.etc}</p>
                    <p>{userObj.rank}</p>
                
                    <p>
                        <ActiveStatus style={{ backgroundColor: userObj.status === "정상" ? "#28a745" : "#dc3545" }} />
                        {userObj.status}
                    </p>

                    {statusProp === "정상" ? (
                        <ButtonCell>
                            <button onClick={toggleEditing}>수정</button>
                            <button onClick={() => setWithdrawalToggle(true)}>탈퇴</button>
                            <button onClick={() => onDeleteClick(userObj.id)}>삭제</button>
                        </ButtonCell>
                    ) : (
                        <>
                            <p>{userObj.reason}</p>
                            
                            <ButtonCell>
                                <button onClick={toggleEditing}>수정</button>
                                <button onClick={() => setWithdrawalToggle(true)}>복구</button>
                                <button onClick={() => onDeleteClick(userObj.id)}>삭제</button>
                            </ButtonCell>
                        </>
                    )}
                </UserContainer>
            )}
            

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
                            <button onClick={() => onWithdrawalClick(statusProp)}>{statusProp === "정상" ? "탈퇴" : "복구"}</button>
                            <button onClick={() => setWithdrawalToggle(false)}>취소</button>
                        </ModalButtonContainer>
                    </div>
                </ModalAlert>
            }
        </>
    );
};

export default UserList;