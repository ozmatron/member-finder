import React from "react";
import { useEffect, useState } from "react";
import { ModalHeader, ModalBody, Spinner, Row, Col, Alert } from "reactstrap";
import moment from "moment";

export default function MemberDetail({ memberId, toggle }) {
  const [membersDetail, setMemberDetail] = useState({});
  const [votesDetail, setVotesDetail] = useState([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [votesLoading, setVotesLoading] = useState(false);
  const [sitsInHouse, setSitsInHouse] = useState(-1);

  const callMemberDetailApi = () => {
    let endpoint = `https://members-api.parliament.uk/api/Members/${memberId}`;
    setMemberLoading(true);
    fetch(`${endpoint}`)
      .then((response) => response.json())
      .then(
        (data) => (
          console.log("member data", data),
          setMemberDetail(data),
          setSitsInHouse(data.value.latestHouseMembership.house)
        )
      )
      .finally(() => {
        setMemberLoading(false);
      });
  };

  const callMemberVotesApi = (house) => {
    let endpoint;
    if (house === "commons") {
      endpoint = `https://commonsvotes-api.parliament.uk/data/divisions.json/membervoting?queryParameters.memberId=${memberId}`;
    } else {
      endpoint = `https://lordsvotes-api.parliament.uk/data/divisions/membervoting?queryParameters.memberId=${memberId}`;
    }
    setVotesLoading(true);
    fetch(`${endpoint}`)
      .then((response) => response.json())
      .then((data) => (console.log("vote data", data), setVotesDetail(data)))
      .finally(() => {
        setVotesLoading(false);
      });
  };

  useEffect(() => {
    callMemberDetailApi();
  }, [memberId]);

  useEffect(() => {
    if (sitsInHouse > 0) {
      if (sitsInHouse === 1) {
        callMemberVotesApi("commons");
      } else {
        callMemberVotesApi("lords");
      }
    }
  }, [sitsInHouse]);

  return (
    <>
      {memberLoading ? (
        <div className="text-center py-4">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          <ModalHeader toggle={toggle}>
            {membersDetail.value && membersDetail.value.nameDisplayAs}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <h3>About</h3>
                <p>
                  <strong>Party:</strong>{" "}
                  {membersDetail.value && membersDetail.value.latestParty.name}
                </p>
                <p>
                  <strong>Member of:</strong>{" "}
                  {sitsInHouse > 0
                    ? sitsInHouse === 1
                      ? "House of Commons"
                      : "House of Lords"
                    : "Not available"}
                </p>
                <p>
                  <strong>
                    {sitsInHouse === 1 ? "Constituency: " : "Peerage: "}
                  </strong>{" "}
                  {membersDetail.value &&
                    membersDetail.value.latestHouseMembership.membershipFrom}
                </p>
                <p>
                  <strong>Date joined:</strong>{" "}
                  {membersDetail.value &&
                    moment(
                      membersDetail.value.latestHouseMembership
                        .membershipStartDate
                    ).format("DD-MM-YYYY")}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <h3>Votes</h3>
                {votesLoading ? (
                  <div className="text-center py-4">
                    <Spinner color="primary" />
                  </div>
                ) : votesDetail.length > 0 ? (
                  votesDetail
                    .filter((item, idx) => idx < 3)
                    .map((item) => (
                      <p>
                        <strong>Bill:</strong>{" "}
                        {sitsInHouse === 1
                          ? item.PublishedDivision.Title
                          : item.publishedDivision.title}
                        <br></br>
                        <strong>Vote cast:</strong>{" "}
                        {item.MemberVotedAye ? "Aye" : "Nay"}
                      </p>
                    ))
                ) : (
                  <div>
                    <Alert color="warning">
                      No votes can be found for this member
                    </Alert>
                  </div>
                )}
              </Col>
            </Row>
          </ModalBody>
        </>
      )}
    </>
  );
}
