import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { authService, dbService } from "../fbase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";

const UserContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    align-items: center;
    
    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;

    background-color: #fff;
    
    color: #000;
    font-size: 18px;

    padding: 1rem;

    text-align: center;

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
    display: flex;
    flex-direction: row;
    font-size: 17px;

    & p {
        border-radius: 5px;
        color: #fff;
        padding: 5px;
        border: none;

        cursor: pointer;
    }

    & p:first-child {
        background-color: skyblue;    
    }

    & p:nth-child(2) {
        background-color: red;
        margin: 0 5px;
    }

    & p:last-child {
        background-color: orange;
    }
`;


const ModalAlert = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    color: #000;

    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;

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

        & input {
            border: 1px solid #dadada;
            border-radius: 5px;
            padding: 10px;
            margin-right: 10px;
        }
    }
`;

const ModalButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & > p {
        border: none;
        border-radius: 5px;

        color: #fff;
        font-size: 17px;

        padding: 5px 10px;
        
        cursor: pointer;
    }

    & > p:first-child {
        background-color: red;
    }

    & > p:last-child {
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


const EtcModalAlert = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);

    font-size: 20px;

    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;

    & > div {
        width: 700px;
        height: 700px;
        background: #fff;
        color: #000;
        
        position: absolute;
        left: 50%;
        top: 50%;

        margin-left: -350px;
        margin-top: -350px;
        padding: 15px;

        box-sizing: border-box;
        border-radius: 5px;

        & p {
            margin: 0;
        }

        & > div:first-child {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            padding: 20px 5px;
        }
    }
`;

const ContentForm = styled.div`
    height: calc(700px - 160px);

    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
    padding: 10px;

    white-space: pre-wrap;
    overflow-y: scroll;

    line-height: 1.3;
`;

const InputFormContainer = styled.div`
    display: flex;
    flex-direction: column;

    & textarea {
        resize: none;

        height: calc(700px - 160px);

        border: none;
        box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
        border-radius: 5px;
        padding: 10px;

        margin-bottom: 20px;

        overflow-y: scroll;
    }

    & p {
        border-radius: 5px;
        color: #fff;
        padding: 5px 10px;
        border: none;
        background-color: #14aaf5;
        text-align: center;
        cursor: pointer;
    }
`;

const EtcContainer = styled.div`
    display: flex;
    flex-direction: column;

    & > div {
        margin-bottom: 20px;
    }

    & > p {
        border-radius: 5px;
        color: #fff;
        padding: 5px 10px;
        border: none;
        background-color: #14aaf5;
        text-align: center;
        cursor: pointer;
    }
`;

const DetailButton = styled.p`
    border-radius: 5px;
    color: #fff;
    padding: 5px;
    border: none;

    background-color: orange;
    font-size: 17px;

    cursor: pointer;
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

const UserList = ({ statusProp, userData, index, userObj }) => {
    // 날짜 계산을 위한 오늘 날짜
    const date = moment().format("YYYY-MM-DD");

    // 수정 관련 state
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(userData.name);
    const [newRoot, setNewRoot] = useState(userData.regist_root);
    const [newPartner, setNewPartner] = useState(userData.partner);
    const [newEtc, setNewEtc] = useState(userData.etc);
    const [newRank, setNewRank] = useState(userData.rank);
    const [newReason, setNewReason] = useState(userData.reason);

     // Modal 관련 state
    const [withdrawalToggle, setWithdrawalToggle] = useState(false);
    const [etcModalToggle, setEtcModalToggle] = useState(false);
    const [etcModifyToggle, setEtcModifyToggle] = useState(false);

    // 탈퇴 사유 관련 state
    const [reason, setReason] = useState("");
    const [userName, setUserName] = useState();

    // 날짜 관련 statue
    const [outDate, setOutDate] = useState(userData.out_date);
    const [registDate, setRegistDate] = useState(userData.regist_date);

    // Select 항목 배열
    const rootSelect = ["부대홍보글(인벤)", "부대홍보글(공홈)", "지인초대", "외치기", "기타"];
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
        setEditing(false);

        await updateDoc(doc(dbService, "users", userData.id), {
            name: newName,
            regist_root: newRoot,
            partner: newPartner,
            rank: newRank,
            reason: newReason,
            regist_date: registDate,
            out_date: outDate,
        });

        await addDoc(collection(dbService, "logs"), {
            date: new Date(),
            name: newName,
            type: "UserModify",
            writer: userObj.displayName,
        });
    };

    const onEtcSubmit = async (event) => {
        event.preventDefault()
        setEtcModalToggle(false);
        setEtcModifyToggle(false);

        await updateDoc(doc(dbService, "users", userData.id), {
            etc: newEtc,
        });
    }

    const onDeleteClick = async (id) => {
        const ok = window.confirm("삭제하시겠습니까?");

        if (ok) {
            await addDoc(collection(dbService, "logs"), {
                date: new Date(),
                name: newName,
                type: "UserDelete",
                writer: userObj.displayName,
            });

            await deleteDoc(doc(dbService, "users", id));
        }
    };

    const onWithdrawalClick = async (value) => {
        if (reason === "" && value === "정상") {
            alert("탈퇴 사유를 입력해주세요.");
            return false;
        }

        if (value === "정상") {
            await updateDoc(doc(dbService, "users", userData.id), {
                status: "탈퇴",
                reason: reason,
                out_date: new Date(),
            });

            await addDoc(collection(dbService, "logs"), {
                date: new Date(),
                name: newName,
                type: "UserOut",
                writer: authService.currentUser.displayName,
            });
        } else if (value === "탈퇴") {
            await updateDoc(doc(dbService, "users", userData.id), {
                status: "정상",
                reason: "",
                out_date: new Date(),
            });

            await addDoc(collection(dbService, "logs"), {
                date: new Date(),
                name: newName,
                type: "UserIn",
                writer: authService.currentUser.displayName,
            });
        }

        setWithdrawalToggle(false);
        setReason("");
    };

    const toggleEditing = () => {
        setEditing((prev) => !prev);
    };

    const closeEtcModal = () => {
        setEtcModalToggle(false);
        setEtcModifyToggle(false);
        setNewEtc(userData.etc);
    };

    return (
        <>
            {editing ? (
                <UserContainer>
                    <p style={{flex: "0.2"}}>{index}</p>
                    <Input
                        type="text"
                        name="NewName"
                        value={newName}
                        onChange={onChange}
                        placeholder="이름"
                        autoComplete='off'
                    />


                    {statusProp === "정상" ? (
                        <>
                            <DatePickerBox>
                                <DatePicker
                                    selected={registDate}
                                    onChange={(date) => setRegistDate(date)}
                                    locale={ko}
                                    dateFormat="yyyy-MM-dd"
                                />
                            </DatePickerBox>
                            <p>{moment(date).diff(moment(userData.regist_date), "days")}일</p>
                        </>
                    ) : (
                        <>
                            <p>{moment(userData.regist_date).format("YYYY-MM-DD")}</p>
                            <DatePickerBox>
                                <DatePicker
                                    selected={outDate}
                                    onChange={(date) => setOutDate(date)}
                                    locale={ko}
                                    dateFormat="yyyy-MM-dd"
                                />
                            </DatePickerBox>
                        </>
                    )}

                    <Select name="NewRootSelect" value={newRoot} onChange={onChange}>
                        {rootSelect.map((data, index) => (
                            <option key={index} value={data}>
                                {data}
                            </option>
                        ))}
                    </Select>

                    <Input
                        type="text"
                        name="NewPartner"
                        value={newPartner}
                        onChange={onChange}
                        placeholder="지인"
                        autoComplete='off'
                    />
                    <DetailButton onClick={() => setEtcModalToggle(true)}>자세히</DetailButton>

                    <Select name="NewRankSelect" value={newRank} onChange={onChange}>
                        {rankSelect.map((data, index) => (
                            <option key={index} value={data}>
                                {data}
                            </option>
                        ))}
                    </Select>
                    <p>
                        <ActiveStatus style={{ backgroundColor: userData.status === "정상" ? "#28a745" : "#dc3545" }} />
                        {userData.status}
                    </p>

                    {userData.status === "탈퇴" ? (
                        <Input
                            type="text"
                            name="NewReason"
                            value={newReason}
                            onChange={onChange}
                            placeholder="탈퇴 사유"
                            autoComplete='off'
                        />
                    ) : (
                        <p>-</p>
                    )}
                    <ButtonCell>
                        <p onClick={onSubmit}>수정완료</p>
                        <p onClick={toggleEditing}>취소</p>
                    </ButtonCell>
                </UserContainer>
            ) : (
                <UserContainer>
                    <p>{index}</p>
                    <p>{userData.name}</p>
                    <p>{moment(userData.regist_date).format("YYYY-MM-DD")}</p>

                    {statusProp === "정상" ? (
                        <p>{moment(date).diff(moment(userData.regist_date), "days")+1 }일</p>
                    ) : (
                        <p>{moment(userData.out_date).format("YYYY-MM-DD")}</p>
                    )}

                    <p>{userData.regist_root}</p>
                    <p>{userData.partner}</p>
                    <DetailButton onClick={() => setEtcModalToggle(true)}>자세히</DetailButton>
                    <p>{userData.rank}</p>

                    <p>
                        <ActiveStatus style={{ backgroundColor: userData.status === "정상" ? "#28a745" : "#dc3545" }} />
                        {userData.status}
                    </p>

                        {statusProp === "정상" ? (
                        <>
                            <p>-</p>

                            <ButtonCell>
                                <p onClick={toggleEditing}>수정</p>
                                <p onClick={() => setWithdrawalToggle(true)}>탈퇴</p>
                                <p onClick={() => onDeleteClick(userData.id)}>삭제</p>
                            </ButtonCell>
                        </>
                    ) : (
                        <>
                            <p>{userData.reason}</p>

                            <ButtonCell>
                                <p onClick={toggleEditing}>수정</p>
                                <p onClick={() => setWithdrawalToggle(true)}>복구</p>
                                <p onClick={() => onDeleteClick(userData.id)}>삭제</p>
                            </ButtonCell>
                        </>
                    )}
                </UserContainer>
            )}


            {/* 탈퇴 사유 관련 Modal */}
            {withdrawalToggle &&
                <ModalAlert>
                    <div>
                        <p>알림</p>
                        <span>{statusProp === "정상" ? "탈퇴 사유를 적어주세요." : "복구 할까요?"}</span>
                        {statusProp === "정상" &&
                            <input type="text" name="reason" onChange={onChange} value={reason} placeholder="탈퇴 사유" />
                        }

                        <ModalButtonContainer>
                            <p onClick={() => onWithdrawalClick(statusProp)}>{statusProp === "정상" ? "탈퇴" : "복구"}</p>
                            <p onClick={() => setWithdrawalToggle(false)}>취소</p>
                        </ModalButtonContainer>
                    </div>
                </ModalAlert>
            }

            {/* 비고 관련 Modal */}
            {etcModalToggle &&
                <EtcModalAlert>
                    <div>
                        <div>
                            <p>비고</p>
                            <FontAwesomeIcon icon={faXmark} onClick={() => closeEtcModal()} style={{ cursor: "pointer" }} />
                        </div>

                        {etcModifyToggle ? (
                            <InputFormContainer>
                                <textarea
                                    placeholder="특이 사항을 적어주세요."
                                    value={newEtc}
                                    onChange={onChange}
                                    name="NewEtc"
                                />
                                <p onClick={onEtcSubmit}>수정완료</p>
                            </InputFormContainer>
                        ) : (
                            <EtcContainer>
                                <ContentForm>
                                    {newEtc}
                                </ContentForm>

                                <p onClick={() => setEtcModifyToggle(true)}>
                                    수정
                                </p>
                            </EtcContainer>
                        )}
                    </div>
                </EtcModalAlert>
            }
        </>
    );
};

export default UserList;
