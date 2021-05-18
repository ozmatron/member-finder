import "./App.css";
import { useEffect, useState } from "react";
import { Row, Modal, Alert } from "reactstrap";
import MemberCards from "./member-cards";
import DisplayPagination from "./pagination";
import MemberDetail from "./member-details";
import Filters from "./filters";

function App() {
  const takeNumber = 20;
  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectHouse, setSelectHouse] = useState("");
  const [search, setSearch] = useState("");
  const [membersResults, setMembersResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [apiError, setApiError] = useState(false);

  const toggleModal = () => setOpenModal(!openModal);

  const callMemberApi = (filterByName, filterByHouse) => {
    let skipNum = currentPage === 1 ? 0 : (currentPage - 1) * 20;
    let endpoint = `https://members-api.parliament.uk/api/Members/Search`;
    if (filterByName) {
      endpoint = `${endpoint}?name=${search}&house=${selectHouse}&take=${takeNumber}&skip=${skipNum}&IsCurrentMember=true`;
    } else if (!filterByName && filterByHouse) {
      endpoint = `${endpoint}?house=${selectHouse}&take=${takeNumber}&skip=${skipNum}&IsCurrentMember=true`;
    } else {
      endpoint = `${endpoint}?skip=${skipNum}&take=${takeNumber}&IsCurrentMember=true`;
    }
    setLoading(true);
    fetch(`${endpoint}`)
      .then((response) => response.json())
      .then(
        (data) => (
          console.log("data", data),
          data.totalResults > 0 && setTotalResultsCount(data.totalResults),
          setMembersResults(data.items)
        )
      )
      .catch(() => setApiError(true))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (search.length > 3 || selectHouse !== "") {
      callMemberApi(search.length > 3, selectHouse !== "");
    } else {
      callMemberApi(false);
    }
  }, [search, selectHouse, currentPage]);

  return (
    <div className="wrapper">
      <header></header>
      <div className="header">
        <h1>MPs and Lords</h1>
      </div>
      {!apiError ? (
        <>
          <div className="filterbox">
            <Row>
              <Filters
                search={search}
                selectHouse={selectHouse}
                onSearch={setSearch}
                onSelectHouse={setSelectHouse}
              ></Filters>
            </Row>
          </div>
          <div className="memberbox">
            <Row>
              <MemberCards
                membersResults={membersResults}
                loading={loading}
                openModal={openModal}
                onViewMore={setOpenModal}
                onSelectMember={setMemberId}
              ></MemberCards>
            </Row>
          </div>
          <div className="pagination">
            <Row>
              <DisplayPagination
                count={totalResultsCount}
                onPageChange={setCurrentPage}
                page={currentPage}
                pageSize={takeNumber}
              ></DisplayPagination>
            </Row>
          </div>
        </>
      ) : (
        <div className="alert">
          <Alert color="danger">Service is currently unavailable</Alert>
        </div>
      )}
      <Modal isOpen={openModal} toggle={toggleModal}>
        <MemberDetail memberId={memberId} toggle={toggleModal}></MemberDetail>
      </Modal>
    </div>
  );
}

export default App;
