import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { deleteSparepart } from "service/service";
import axios from "axios";

const Products = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://mataa-backend.onrender.com/products");
        console.log("API Response:", response.data); // Debugging

        if (response.data && Array.isArray(response.data.products)) {
          setSpareParts(response.data.products);
        } else {
          console.error("Unexpected response format", response.data);
          setError("Invalid response format");
          setSpareParts([]); // Fallback to empty array
        }
      } catch (err) {
        console.error("Error fetching spare parts:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    // Fetch data every 5 seconds (to avoid excessive API calls)
    const interval = setInterval(fetchData, 5000);
    fetchData(); // Initial fetch
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteSparepart(id);
        setSpareParts((prev) => prev.filter((part) => part._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Available Spare Parts
      </Typography>
      <Button variant="contained" onClick={() => alert("Feature not implemented")}>
        Add Spare Parts
      </Button>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && spareParts.length > 0 ? (
              spareParts.map((part) => (
                <TableRow key={part._id}>
                  <TableCell>{part._id}</TableCell>
                  <TableCell>{part.make}</TableCell>
                  <TableCell>{part.model}</TableCell>
                  <TableCell>{part.year}</TableCell>
                  <TableCell>
                    <Button onClick={() => alert("Edit feature pending")}>
                      <Edit />
                    </Button>
                    <Button onClick={() => handleDelete(part._id)}>
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {loading ? "Loading..." : "No products available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Products;
