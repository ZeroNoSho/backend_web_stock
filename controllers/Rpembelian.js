import DataBarang from "../models/Databarang.js";
import BahanBaku from "../models/Bahanbaku.js";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
XLSX.set_fs(fs);

export const getPembelian = async (req, res) => {
  const number = parseInt(req.query.limit) || 100;
  try {
    const Barang = await DataBarang.findAll();
    const Bahan = await BahanBaku.findAll();
    const arrayall = [...Bahan, ...Barang];
    const all = [];

    arrayall.forEach((item) => {
      if (item.stok <= number) {
        all.push(item);
      }
    });

    res.json(all);
  } catch (error) {
    console.error(error);
  }
};

export const getPembeliansrch = async (req, res) => {
  const search = req.query.search_query || "";
  const Barang = await DataBarang.findAll();

  const Bahan = await BahanBaku.findAll();

  const arrayall = [...Bahan, ...Barang];

  const searchResults = arrayall.filter((item) => item.nama.includes(search));

  res.json(searchResults);
};

export const getPembelianExel = async (req, res) => {
  const Barang = await DataBarang.findAll();
  const Bahan = await BahanBaku.findAll();

  const arrayall = [...Bahan, ...Barang];
  const heading = [["Nama Barang / Bahan", " satuan", "stok", "tipe", "createdAt", "updatedAt"]];

  const multiDimensionalArray = arrayall.map((obj) => [obj.nama, obj.jenis, obj.stok, obj.tipe, obj.createdAt.toString(), obj.updatedAt.toString()]);

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(multiDimensionalArray);

  XLSX.utils.sheet_add_aoa(worksheet, heading);
  XLSX.utils.book_append_sheet(workbook, worksheet, "books");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  res.attachment("PersedianData.xlsx");
  return res.send(buffer);
};
