import React, {useEffect, useState} from "react";
import styled from "styled-components";
import TitleWithText from "../components/TitleWithText";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {dbService} from "../fbase";

const Home = ({userObj}) => {
    const [data, setData] = useState([]);
    const [requestData, setRequestData] = useState([]);


    useEffect(() => {
        const q = query(collection(dbService, "logs"), orderBy("date", "desc"));
        const requestQuery = query(collection(dbService, "request"), orderBy("date", "desc"));

        onSnapshot(q, (querySnapshot) => {
            const logArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate(),
            }));

            setData(logArray);
        });

        onSnapshot(requestQuery, (querySnapshot) => {
            const requestArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate(),
            }));

            setRequestData(requestArray);
        });
    }, []);

    return (
        <GridContainer>
            <TitleWithText title="각 메뉴 설명" type="text">
                <MenuGuideContainer>
                    <div>
                        <p>* 냥이관리</p>
                        <p>- 부대에 있는 인원 목록 및 관리 할 수 있는 메뉴 입니다.</p>
                    </div>

                    <div>
                        <p>* 탈퇴한냥이</p>
                        <p>- 부대에서 탈퇴한 인원 목록 및 관리 할 수 있는 메뉴 입니다.</p>
                    </div>

                    <div>
                        <p>* 건의사항</p>
                        <p>- 회의가 필요한 안건이나 운영진 개인적으로 건의를 하는 메뉴 입니다.</p>
                    </div>

                    <div>
                        <p>* 회의록</p>
                        <p>- 운영진 회의가 있을 때 기록을 남겨두어 언제든 확인 할 수 있는 메뉴 입니다.</p>
                    </div>

                    <div>
                        <p>* 요청 사항</p>
                        <p>- 필요한 메뉴나 필요한 기능이 있을 때 요청을 하는 메뉴 입니다. "종이 비행기" 아이콘을 눌러 글을 남길 수 있습니다.</p>
                    </div>
                </MenuGuideContainer>
            </TitleWithText>

            <TitleWithText title="부대에 관한 정보" type="text">
                <p>디스코드 주소</p>
                <p><a href="https://discord.gg/H8qMAumfyA" target="_blank">https://discord.gg/H8qMAumfyA</a></p>

                <p style={{marginTop: "20px"}}>오픈 카카오톡 주소</p>
                <p><a href="https://open.kakao.com/o/gO22an2c"
                      target="_blank">https://open.kakao.com/o/gO22an2c</a> (비밀번호: add2648)</p>

                <NewGuideContainer>
                    <div>
                        <p>* 면접 내용</p>
                        <ul>
                            <li>1. 성인인지 여부 확인</li>
                            <li>2. 가입 경로 확인 (공홈, 인벤, 인게임, 지인)</li>
                            <li>3. SNS나 특정사상을 가진 커뮤니티 활동 여부, 사건사고 게시판 등재여부 확인 (트위치, 사사게, 기타등등)</li>
                            <li>4. 방송 등 스트리머 활동여부 확인 (활동시 가입금지)</li>
                            <li>5. 부대공지를 위해 디코 혹은 단톡에 가입이 가능한지 확인 (단톡, 디코 중 선택하여 하나는 필수 가입)</li>
                        </ul>
                    </div>

                    <div>
                        <p>* 면접 후 절차</p>
                        <ul>
                            <li>1. 인게임 자유부대 초대</li>
                            <li>2. 디코 채널 초대 (본인 희망시 오픈 카톡방 초대)</li>
                            <li>3. 부대규칙설명 (특히 미접속에 관한 내용 강조), 미접 45일이후 추방, 사고를 치지 않은 이상 재가입은 언제든 가능</li>
                            <li>4. 츄르 운영 사이트에 정보 기입</li>
                        </ul>
                    </div>
                </NewGuideContainer>
            </TitleWithText>

            <TitleWithText title="활동 내역" type="log" data={data} />
            <TitleWithText title="요청 사항" type="board" data={requestData} userObj={userObj} />
        </GridContainer>
    );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const NewGuideContainer = styled.div`
  margin-top: 20px;

  & > div:first-of-type {
    margin-bottom: 20px;
  }

  & > div > p {
    margin-bottom: 5px;
  }

  & > div > ul > li:not(:last-of-type) {
    margin-bottom: 5px;
  }
`;

const MenuGuideContainer = styled.div`
    & > div {
      margin-bottom: 20px;
    }
`;

export default Home;
