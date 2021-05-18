import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import {
  Card,
  Button,
  CardImg,
  CardTitle,
  CardDeck,
  CardSubtitle,
  CardBody,
  Spinner,
  Alert,
} from "reactstrap";

export default function MemberCards({
  membersResults,
  loading,
  openModal,
  onViewMore,
  onSelectMember,
}) {
  const [memberSplitArray, setMemberSplitArray] = useState([]);

  const splitArrayIntoChunks = (array, size) => {
    let splitArray = array.reduce(
      (acc, e, i) => (
        i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
      ),
      []
    );
    return splitArray;
  };

  useEffect(() => {
    if (membersResults.length > 0) {
      setMemberSplitArray(splitArrayIntoChunks(membersResults, 4));
    }
  }, [membersResults]);

  return (
    <>
      {loading ? (
        <div className="text-center py-4">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          {membersResults.length > 0 ? (
            memberSplitArray.map((array) => (
              <CardDeck style={{ display: "flex", flexDirection: "row" }}>
                {array.map((member) => (
                  <Card className="member-card">
                    <CardImg
                      top
                      src={
                        member.value.thumbnailUrl
                          ? member.value.thumbnailUrl
                          : ""
                      }
                      alt="Member image"
                    />
                    <CardBody>
                      <CardTitle tag="h5">
                        {member.value.nameDisplayAs
                          ? member.value.nameDisplayAs
                          : "Not available"}
                      </CardTitle>
                      <CardSubtitle tag="h6" className="mb-2 text-muted">
                        {member.value.latestParty &&
                        member.value.latestParty.name
                          ? member.value.latestParty.name
                          : "Not available"}
                      </CardSubtitle>
                      <Button
                        onClick={() => (
                          onViewMore(!openModal),
                          onSelectMember(member.value.id)
                        )}
                      >
                        View more...
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </CardDeck>
            ))
          ) : (
            <div className="alert">
              <Alert color="warning">
                No results match that filter criteria
              </Alert>
            </div>
          )}
        </>
      )}
    </>
  );
}
