import styled from "styled-components";
import UserTable from "../components/UserTable";

const FlexBox = styled.div`
    display: flex;
    flex-direction: column;

    & > div {
        margin: 20px;
        
    }
`;

const DashBoard = () => {
    const columns = [
        { Header: "번호" },
        { Header: "이름" },
        { Header: "가입일" },
        { Header: "가입기간" },
        { Header: "가입방법" },
        { Header: "지인" },
        { Header: "비고"  },
        { Header: "계급" },
        { Header: "수정 / 탈퇴 / 삭제" },
        { Header: "상태" },
    ];

    const withdrawalColumns = [
        { Header: "번호" },
        { Header: "이름" },
        { Header: "가입일" },
        { Header: "가입기간" },
        { Header: "가입방법" },
        { Header: "지인" },
        { Header: "비고"  },
        { Header: "계급" },
        { Header: "탈퇴사유" },
        { Header: "수정 / 탈퇴 / 삭제" },
        { Header: "상태" },
    ];

    return (
        <FlexBox>
            <div>
                <UserTable
                    columns={columns}
                    statusProp={"정상"}
                />
            </div>

            <div>
                <UserTable
                    columns={withdrawalColumns}
                    statusProp={"탈퇴"}
                />
            </div>
        </FlexBox>
    );
};

export default DashBoard;