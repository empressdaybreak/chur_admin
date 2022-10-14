import React, {useState} from "react";
import styled from "styled-components";
import moment from "moment";
import {addDoc, collection} from "firebase/firestore";
import {dbService} from "../fbase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faShieldCat, faXmark} from "@fortawesome/free-solid-svg-icons";

type LogProps = {
    type: "log" | "text" | "board";
    title: string;
    data?: [];
    children?: React.PropsWithChildren;
    userObj?: any;
}

const TitleWithText: React.FC<LogProps> = (props) => {
    const [modalToggle, setModalToggle] = useState(false);
    const [isSecret, setIsSecret] = useState(false);
    const [contentDesc, setContentDesc] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();

        setModalToggle(false);

        await addDoc(collection(dbService, "request"), {
            date: new Date(),
            desc: contentDesc,
            isSecret: isSecret,
            writer: props.userObj.displayName,
        });

        setContentDesc("");
        setIsSecret(false);
    };

    const checkedSecret = (e) => {
        setIsSecret(e);
    }

    const changeDesc = (e) => {
        setContentDesc(e);
    }

    return (
        <div>
            <ListHeader>
                <p>{props.title}</p>
                {props.type === "board" ? (
                    <div onClick={() => setModalToggle(true)} style={{cursor: "pointer"}}>
                        <p>
                            <FontAwesomeIcon icon={faPaperPlane}/>
                        </p>
                        <p>남기기</p>
                    </div>
                ) : (
                    <p><FontAwesomeIcon icon={faShieldCat}/></p>
                )}
            </ListHeader>

            <Card>
                {props.type === "log" &&
                    <>
                        {props.data.map((item, index) => (
                            <DataRow key={index}>
                                <p>[{moment(item.date).format("YYYY-MM-DD")}]</p>
                                <p>
                                    "{item.writer.replace(process.env.REACT_APP_USERAUTH_TAG, '')}" 님이
                                    {item.type === "UserAdd" && ` "${item.name}" 님을 등록 하였습니다.`}
                                    {item.type === "UserModify" && ` "${item.name}" 의 정보를 수정 하였습니다.`}
                                    {item.type === "UserDelete" && ` "${item.name}" 을 삭제 하였습니다.`}
                                    {item.type === "UserOut" && ` "${item.name}" 을 탈퇴 처리 하였습니다.`}
                                    {item.type === "UserIn" && ` "${item.name}" 을 복구 처리 하였습니다.`}
                                    {item.type === "ProposalAdd" && " 새로운 안건을 등록 하였습니다."}
                                </p>
                            </DataRow>
                        ))}

                        {props.data.length === 0 &&
                            <p style={{textAlign: "center"}}>{props.title}이 없습니다.</p>
                        }
                    </>
                }

                {props.type === "text" &&
                    <>
                        {props.children}
                    </>
                }

                {props.type === "board" &&
                    <>
                        {props.data.map((item, index) => (
                            <DataRow key={index}>
                                {item.isSecret ? (
                                    <>
                                        {item.writer === props.userObj.displayName || props.userObj.displayName === "토꾸@breadcat" ? (
                                            <>
                                                <p>[{item.writer.replace(process.env.REACT_APP_USERAUTH_TAG, '')} (비밀글)]</p>
                                                <p>{item.desc}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p> [익명의 빛의 전사] </p>
                                                <p>익명의 빛의 전사가 남긴 기록입니다.</p>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <p>[{item.writer.replace(process.env.REACT_APP_USERAUTH_TAG, '')}]</p>
                                        <p>{item.desc}</p>
                                    </>
                                )}
                            </DataRow>
                        ))}

                        {props.data.length === 0 &&
                            <p style={{textAlign: "center"}}>{props.title}이 없습니다.</p>
                        }
                    </>
                }
            </Card>

            {modalToggle &&
                <ModalAlert>
                    <div>
                        <div>
                            <p>문의 사항</p>
                            <FontAwesomeIcon
                                icon={faXmark}
                                onClick={() => setModalToggle(false)}
                                style={{cursor: "pointer"}}
                            />
                        </div>

                        <InputForm onSubmit={onSubmit} name="newMinutes">
                            <textarea
                                placeholder="문의 내용을 적어주세요."
                                value={contentDesc}
                                onChange={(e) => changeDesc(e.target.value)}
                                name="textBox"
                            />

                            <div>
                                <p>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => checkedSecret(e.target.checked)}
                                        checked={isSecret}
                                    /> 비밀글</p>
                                <button>등록</button>
                            </div>
                        </InputForm>
                    </div>
                </ModalAlert>
            }
        </div>
    );
};


const Card = styled.div`
  margin: 20px;

  border: none;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  border-radius: 5px;

  padding: 15px;

  color: #000;
  font-size: 20px;
  line-height: 1.3;

  position: relative;

  background-color: #fff;

  height: 400px;
  overflow: auto;

  & > p {
    white-space: pre-wrap;
    position: relative;
  }
`;

const ListHeader = styled.div`
  border-bottom: 3px solid #fff;
  padding-bottom: 10px;
  margin: 20px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & p {
    font-size: 25px;
  }

  & > div {
    display: flex;
    flex-direction: row;

    & > p:first-of-type {
      margin-right: 10px;
    }
  }
`;


const ModalAlert = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: #000;

  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;

  & > div {
    width: 400px;
    height: 400px;
    background: #fff;

    font-size: 20px;

    position: absolute;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);
    padding: 15px;

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


const InputForm = styled.form`
  display: flex;
  flex-direction: column;

  & textarea {
    resize: none;

    height: calc(400px - 160px);

    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
    padding: 10px;

    margin-bottom: 20px;

    overflow-y: auto;
  }

  & button {
    border-radius: 5px;
    padding: 5px 10px;
    border: none;
    background-color: #14aaf5;
    cursor: pointer;

    font-family: 'CookieRun-Regular', serif;
    font-size: 18px;
    color: #fff;
  }

  & > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const DataRow = styled.div`
  display: flex;
  flex-direction: row;

  & > p:first-of-type {
    margin-right: 10px;
  }
`;

export default TitleWithText;
