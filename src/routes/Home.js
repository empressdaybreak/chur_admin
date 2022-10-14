import React from "react";
import styled from "styled-components";
import Log from "../components/Log";
import moment from "moment/moment";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Home = () => {
    return (
        <GridContainer>
            <Log/>

            <div>
                <ListHeader>
                    <p>각 메뉴 설명</p>
                </ListHeader>

                <Card>
                    <p>냥이관리<br />- 부대에 있는 인원 목록 및 관리 할 수 있는 메뉴 입니다.</p>
                    <br />
                    <p>탈퇴한냥이<br />- 부대에서 탈퇴한 인원 목록 및 관리 할 수 있는 메뉴 입니다.</p>
                    <br />
                    <p>건의사항<br />- 회의가 필요한 안건이나 운영진 개인적으로 건의를 하는 메뉴 입니다.</p>
                    <br />
                    <p>회의록<br />- 운영진 회의가 있을 때 기록을 남겨두어 언제든 확인 할 수 있는 메뉴 입니다.</p>
                    <br /><br />
                    <p>이외에 필요한 메뉴나 필요한 기능이 있다면 "토꾸'당근가게" 에게 문의 주세요.</p>
                </Card>
            </div>
        </GridContainer>
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

export default Home;
