import React from "react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Col,
    Form,
    Label,
    Input,
    Dropdown,
  } from 'reactstrap';
import { useEffect, useState } from "react";

export default function Filters({
  search,
  selectHouse,
  onSearch,
  onSelectHouse
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <>
      <Col>
          <Form>
            <FormGroup>
              <Label className='label'>Search by name...</Label>
              <Input type="text" value={search} onChange={e => onSearch(e.target.value)}/>
            </FormGroup>
          </Form>
        </Col>
        <Col>
        <Label className='label'>Filter by House...</Label>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              {selectHouse.length > 0 ? selectHouse === 'commons' ? 'House of Commons' : 'House of Lords' : 'All'}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => onSelectHouse('')}>All</DropdownItem>
              <DropdownItem onClick={() => onSelectHouse('commons')}>House of Commons</DropdownItem>
              <DropdownItem onClick={() => onSelectHouse('lords')}>House of Lords</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
    </>
  );
}
