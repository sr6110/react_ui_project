import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, FormControl, InputLabel, Select, MenuItem, TextField, TableSortLabel } from '@mui/material';
import { userActions } from '_store';

export { Audit };

function Audit() {
  const users = useSelector((state) => state.users.list);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateFormat, setDateFormat] = useState('dd/MM/yyyy hh:mm:ss');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
const [sortOrder, setSortOrder] = useState('asc');


  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDateFormat = (event) => {
    setDateFormat(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const formattedDate = (date) => {
    return format(parseISO(date), dateFormat);
  };

  const filteredUsers = users?.value?.filter((user) =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };
  
  // Sort the filteredUsers array based on the selected column and order
  let sortedUsers = filteredUsers?.slice().sort((a, b) => {
    if (sortColumn === 'firstName') {
      return sortOrder === 'asc' ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName);
    }
    if (sortColumn === 'lastName') {
      return sortOrder === 'asc' ? a.lastName.localeCompare(b.lastName) : b.lastName.localeCompare(a.lastName);
    }
    if (sortColumn === 'username') {
      return sortOrder === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
    }
    if (sortColumn === 'createdDate') {
      return sortOrder === 'asc' ? a.createdDate.localeCompare(b.createdDate) : b.createdDate.localeCompare(a.createdDate);
    }
    return 0;
  });
  
  return (
    <div>
      <h1>Auditor Page</h1>
      <FormControl sx={{ marginBottom: '1rem' }}>
        <InputLabel id="date-format-label">Date/Time Format</InputLabel>
        <Select
          labelId="date-format-label"
          id="date-format-select"
          value={dateFormat}
          onChange={handleChangeDateFormat}
        >
          <MenuItem value="dd/MM/yyyy hh:mm:ss">12-hour (DD/MM/YYYY hh:mm:ss a)</MenuItem>
          <MenuItem value="dd/MM/yyyy HH:mm:ss">24-hour (DD/MM/YYYY HH:mm:ss)</MenuItem>
        </Select>
      </FormControl>
      <TextField
        id="search"
        label="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <TableContainer>
        <Table>
        <TableHead>
        <TableRow>
          <TableCell style={{ width: '30%' }}>
            <TableSortLabel
              active={sortColumn === 'firstName'}
              direction={sortColumn === 'firstName' ? sortOrder : 'asc'}
              onClick={() => handleSort('firstName')}
            >
              First Name
            </TableSortLabel>
          </TableCell>
          <TableCell style={{ width: '30%' }}>
            <TableSortLabel
              active={sortColumn === 'lastName'}
              direction={sortColumn === 'lastName' ? sortOrder : 'asc'}
              onClick={() => handleSort('lastName')}
            >
              Last Name
            </TableSortLabel>
          </TableCell>
          <TableCell style={{ width: '30%' }}>
            <TableSortLabel
              active={sortColumn === 'username'}
              direction={sortColumn === 'username' ? sortOrder : 'asc'}
              onClick={() => handleSort('username')}
            >
              Username
            </TableSortLabel>
          </TableCell>
          <TableCell style={{ width: '30%' }}>
            <TableSortLabel
              active={sortColumn === 'createdDate'}
              direction={sortColumn === 'createdDate' ? sortOrder : 'asc'}
              onClick={() => handleSort('createdDate')}
            >
              Created Date
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
      
          <TableBody>
            {sortedUsers
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{formattedDate(user.createdDate)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
