import React from "react";
import styled from "styled-components";
import moment from "moment";

type LogProps = {
    type: "log" | "text";
    title: string;
    data?: [];
    children?: React.PropsWithChildren;
}

const TitleWithText: React.FC<LogProps> = (props) => {
    return (
        <div>
            <ListHeader>
                <p>{props.title}</p>
            </ListHeader>

            <Card>
                {props.type === "log" &&
                    <>
                        {props.data.map((item, index) => (
                            <div key={index}>
                                <p>
                                    [{moment(item.date).format("YYYY-MM-DD")}]
                                    "{item.writer.replace(process.env.REACT_APP_USERAUTH_TAG, '')}" 님이
                                    {item.type === "UserAdd" && ` "${item.name}" 님을 등록 하였습니다.`}
                                    {item.type === "UserModify" && ` "${item.name}" 의 정보를 수정 하였습니다.`}
                                    {item.type === "UserDelete" && ` "${item.name}" 을 삭제 하였습니다.`}
                                    {item.type === "UserOut" && ` "${item.name}" 을 탈퇴 처리 하였습니다.`}
                                    {item.type === "UserIn" && ` "${item.name}" 을 복구 처리 하였습니다.`}
                                    {item.type === "ProposalAdd" && "새로운 안건을 등록 하였습니다."}
                                </p>
                            </div>
                        ))}

                        {props.data.length === 0 &&
                            <p style={{textAlign: "center"}}>활동내역이 없습니다.</p>
                        }
                    </>
                }

                {props.type === "text" &&
                    <>
                        {props.children}
                    </>
                }
            </Card>
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

  text-align: center;

  & p {
    font-size: 25px;
  }
`;

export default TitleWithText;
