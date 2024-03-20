import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BiXCircle, BiPlus } from 'react-icons/bi';
import { AiOutlineFileText } from 'react-icons/ai';
import { useGlobalContext } from '../Context.jsx';

const Invoice = () => {
  const [invoiceItems, setInvoiceItems] = useState([{ productName: '', quantity: 1, price: 0, cgst: 0, sgst: 0, }]);

  const [invoiceNumber, setInvoiceNumber] = useState();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [contact, setContact] = useState('NA');
  const [selectedOption, setSelectedOption] = useState('Cash');
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [adjustment, setAdjustment] = useState(0);
  const [financeBy, setFinanceBy] = useState('');
  const [downPayment, setDownPayment] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanNumber, setLoanNumber] = useState('');
  const [emi, setEmi] = useState('6 Months');
  const { formData, setFormData } = useGlobalContext();
  const navigate = useNavigate();


  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDay = day < 10 ? '0' + day : day;
  const formattedMonth = month < 10 ? '0' + month : month;
  const formattedDate = formattedDay + '/' + formattedMonth + '/' + year;


  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...invoiceItems];
    items[index][name] = value;
    setInvoiceItems(items);
  };

  const handleAddRow = () => {
    setInvoiceItems([...invoiceItems, { productName: '', quantity: 1, price: 0, taxable: 0, cgst: 0, sgst: 0, }]);
  };

  const handleRemoveRow = (index) => {
    const items = [...invoiceItems];
    items.splice(index, 1);
    setInvoiceItems(items);
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleEmiChange = (e) => {
    setEmi(e.target.value);
  };

  useEffect(() => {
    const totalPrice = invoiceItems.reduce((acc, item) => {
      return acc + (item.quantity * item.price);
    }, 0);
    setTotal(totalPrice);
  }, [invoiceItems]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/invoice-number',formData);
        setInvoiceNumber(String(response.data.data + 1).padStart(4, '0'))
        console.log(String(response.data.data + 1).padStart(4, '0'))
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    };
    fetchData();
  }, [setInvoiceNumber]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataValue = {
        name,
        invoiceNumber,
        date: formattedDate,
        address,
        city,
        adjustment,
        contact,
        invoiceItems,
        paymentMode: selectedOption,
        discount,
        total
      };

      if (selectedOption === "Finance") {
        formDataValue.financeBy = financeBy;
        formDataValue.downPayment = downPayment;
        formDataValue.loanAmount = loanAmount;
        formDataValue.loanNumber = loanNumber;
        formDataValue.emi = emi;
      }

      const response = await axios.post('/api/add-invoice', formDataValue);
      setFormData(response.data.data);

      navigate('receipt')

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-full py-2 pb-8">
      <div className="w-full h-16 px-8 flex items-center">
        <h1 className='text-2xl font-semibold flex items-center gap-2'><AiOutlineFileText /> <span>New Invoice</span></h1>
      </div>

      <form className='flex flex-col' onSubmit={handleSubmit}>

        <div className="w-full bg-[#f8f8f8] px-8 py-2 flex flex-col gap-4 md:flex-row md:gap-8">

          <div className="w-full md:w-1/2">
            <label className='flex items-center gap-4'>
              <h1 className='font-semibold text-red-500'>Invoice No. :</h1>
              <input readOnly className='focus:outline-none bg-transparent border border-gray-300 rounded-md px-2 w-2/3 py-1' disabled defaultValue={invoiceNumber} />

            </label>
          </div>

          <div className="w-full md:w-1/2">
            <label className='flex items-center gap-4'>
              <h1 className='font-semibold text-red-500'>Invoice Date :</h1>
              <input readOnly className='focus:outline-none bg-transparent border border-gray-300 rounded-md px-2 w-2/3 py-1' type="text" value={formattedDate} />
            </label>
          </div>
        </div>


        <div className="w-full bg-[#f8f8f8] px-8 py-2 flex flex-col gap-4 md:flex-row md:gap-8 mb-2">

          <div className="w-full md:w-1/2">
            <label className='flex items-center gap-4'>
              <h1 className='font-semibold'>Customer Name<span className='text-red-500'>*</span> :</h1>
              <input onChange={(e) => setName(e.target.value)} className='focus:outline-none bg-transparent border border-gray-300 rounded-md px-2 w-2/3 py-1 focus:border-blue-500 placeholder:text-sm' type="text" placeholder='Customer Name' value={name} />
            </label>
          </div>

          <div className="w-full md:w-1/2">
            <label className='flex items-center gap-4'>
              <h1 className='font-semibold text-red-500'>GSTIN :</h1>
              <input onChange={(e) => setName(e.target.value)} disabled className='focus:outline-none bg-transparent border border-gray-300 rounded-md px-2 w-2/3 py-1 focus:border-blue-500 placeholder:text-sm' type="text" placeholder='Add a customer' value={'23CTVPN3868B1ZC'} />
            </label>
          </div>
        </div>


        <div className="w-full px-8 py-2 flex flex-col gap-4 md:flex-row md:gap-8">

          <div className="w-full">
            <label className='flex items-center gap-[2rem]'>
              <h1 className='font-semibold'>Address :</h1>
              <input onChange={(e) => setAddress(e.target.value)} className='focus:outline-none bg-transparent border border-gray-300 rounded-md px-2 w-2/3 py-1' type="text" value={address} />
            </label>
          </div>
          <div className="w-full">
            <label className='flex items-center gap-[2rem]'>
              <h1 className='font-semibold'>City :</h1>
              <input onChange={(e) => setCity(e.target.value)} className='focus:outline-none bg-transparent border border-gray-300 rounded-md px-2 w-2/3 py-1' type="text" value={city} />
            </label>
          </div>
        </div>

        <div className="w-full px-8 py-2">
          <label className='flex items-center gap-[2rem]'>
            <h1 className='font-semibold'>Contact :</h1>
            <input onChange={(e) => setContact(e.target.value)} className='focus:outline-none bg-transparent border border-gray-300 rounded-md px-2 w-1/3 py-1' type="text" value={contact} />
          </label>
        </div>


        <div className='overflow-x-auto mt-2 px-2'>
          <div className="w-full h-12 bg-gray-100 border-t border-gray-300 px-4 flex items-center">
            <h1 className='font-semibold'>Item Table</h1>
          </div>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="border py-2 text-sm font-semibold w-1/6 text-start px-2">Product Name</th>
                <th className="border py-2 text-sm font-semibold px-2 w-20">Quantity</th>
                <th className="border py-2 text-sm font-semibold px-2 w-20">Rate</th>
                <th className="border py-2 text-sm font-semibold px-2 w-20">Taxable value</th>
                <th className="border py-2 text-sm font-semibold px-2 w-20">CGST (%)</th>
                <th className="border py-2 text-sm font-semibold px-2 w-20">CGST Amount</th>
                <th className="border py-2 text-sm font-semibold px-2 w-20">SGST (%)</th>
                <th className="border py-2 text-sm font-semibold px-2 w-20">SGST Amount</th>
                <th className="border py-2 text-sm font-semibold">Total</th>

              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, index) => (
                <tr key={index}>
                  <td className="border h-16 flex items-center border-t-0 border-r-0">
                    <textarea
                      name="productName"
                      value={item.productName}
                      onChange={(e) => handleChange(index, e)}
                      placeholder='i.e Motorola G52'
                      className="w-72 rounded-md px-2 py-2 focus:outline-none focus:border focus:border-blue-500 resize-none text-sm"
                    />
                  </td>
                  <td className="border">
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full h-full rounded-md px-2 py-2 focus:outline-none focus:border focus:border-blue-500 resize-none text-sm"
                    />
                  </td>
                  <td className="border">
                    <input
                      type="text"
                      name="price"
                      value={item.price}
                      onChange={(e) => handleChange(index, e)}
                      className="w-24 h-full rounded-md px-2 py-2 focus:outline-none focus:border focus:border-blue-500 resize-none text-sm"
                    />
                  </td>
                  <td className="border">
                    <input
                      type="text"
                      name="taxable"
                      value={(item.price * item.quantity) - (item.price * item.quantity) * (Number(item.cgst) + Number(item.sgst)) / 100}
                      disabled
                      onChange={(e) => handleChange(index, e)}
                      className="w-24 h-full rounded-md px-2 py-2 focus:outline-none focus:border focus:border-blue-500 resize-none text-sm"
                    />
                  </td>

                  <td className="border">
                    <input
                      type="text"
                      name="cgst"
                      value={item.cgst}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full h-full rounded-md px-2 py-2 focus:outline-none focus:border focus:border-blue-500  text-sm"
                    />
                  </td>

                  <td className="border">
                    <input
                      type="text"
                      name="cgstamt"
                      disabled
                      value={(item.price * item.quantity) * item.cgst / 100}
                      onChange={(e) => handleChange(index, e)}
                      className="w-24 h-full rounded-md px-2 py-2 focus:outline-none focus:border focus:border-blue-500  text-sm"
                    />
                  </td>
                  <td className="border">
                    <input
                      type="text"
                      name="sgst"
                      value={item.sgst}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full h-full rounded-md px-2 py-2 focus:outline-none focus:border focus:border-blue-500  text-sm"
                    />
                  </td>
                  <td className="border">
                    <input
                      type="text"
                      name="sgstamt"
                      disabled
                      value={(item.price * item.quantity) * item.sgst / 100}
                      onChange={(e) => handleChange(index, e)}
                      className="w-24 h-full rounded-md px-2 py-2 focus:outline-none focus:border focus:border-blue-500  text-sm"
                    />
                  </td>

                  <td className="border">
                    <input type="text" className="w-24 h-full rounded-md px-2 py-2 focus:outline-none focus:border focus:border-blue-500  text-sm font-semibold" disabled value={(item.price * item.quantity).toLocaleString()} />
                  </td>

                  <td className="">
                    <button onClick={() => handleRemoveRow(index)} className="ml-2"><BiXCircle color={'red'} size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div onClick={handleAddRow} className='flex bg-[#f1f1f1] w-full md:w-max px-3 items-center py-1.5 text-sm gap-2 rounded-md cursor-pointer ml-3'>
          <BiPlus className='bg-blue-600 rounded-full text-white' />
          <span>Add New Row</span>
        </div>


        <div className="flex flex-col md:flex-row gap-4 px-14 py-2">
          <div className="w-[35vw] h-fit bg-[#f8f8f8] rounded-md flex flex-col p-4 gap-4">
            <label className='flex justify-around'>
              <h1 className='font-semibold'>Payment Mode :</h1>
              <select className='w-52 p-1 outline-0 rounded-md cursor-pointer' value={selectedOption} onChange={handleSelectChange}>
                <option value="Cash">Cash</option>
                <option value="Debit/Credit Card">Debit/Credit Card</option>
                <option value="Cheque">Cheque</option>
                <option value="Finance">Finance</option>
                <option value="Upi">Upi</option>
              </select>
            </label>
            {selectedOption == 'Finance' && <label className='flex justify-around'>
              <h1 className='font-semibold text-md'>Finance By :</h1>
              <input onChange={(e) => setFinanceBy(e.target.value)} className='outline-none p-1 border border-gray-400 rounded-md px-2' value={financeBy} type="text" />
            </label>}
            {selectedOption == 'Finance' && <label className='flex justify-around'>
              <h1 className='font-semibold text-md'>Down Payment :</h1>
              <input onChange={(e) => setDownPayment(e.target.value)} className='outline-none p-1 border border-gray-400 rounded-md px-2' value={downPayment} type="number" />
            </label>}
            {selectedOption == 'Finance' && <label className='flex justify-around'>
              <h1 className='font-semibold text-md'>Loan Amount :</h1>
              <input onChange={(e) => setLoanAmount(e.target.value)} className='outline-none p-1 border border-gray-400 rounded-md px-2' value={loanAmount} type="number" />
            </label>}

            {selectedOption == 'Finance' && <label className='flex justify-around'>
              <h1 className='font-semibold text-md'>Loan Number :</h1>
              <input onChange={(e) => setLoanNumber(e.target.value)} className='outline-none p-1 border border-gray-400 rounded-md px-2' value={loanNumber} type="text" />
            </label>}

            {selectedOption == 'Finance' && <label className='flex justify-around'>
              <h1 className='font-semibold text-md'>EMI :</h1>
              <select className='w-52 p-1 outline-0 rounded-md cursor-pointer' value={emi} onChange={handleEmiChange}>
                <option value="6 Months">6 Months</option>
                <option value="8 Months">8 Months</option>
                <option value="12 Months">12 Months</option>
              </select>
            </label>}


          </div>
          <div className="w-[35vw] h-full bg-[#f8f8f8] rounded-md flex flex-col p-4 gap-4">
            <label className='flex w-full justify-between'>
              <h1 className='font-semibold'>Sub Total</h1>
              <h1 className='font-semibold'>{total.toLocaleString()}</h1>
            </label>

            <label className='flex w-full justify-between items-center'>
              <h1>Discount</h1>
              <div className='flex items-center p-1 px-2 rounded-md w-[6vw] border bg-white border-gray-400'>
                <input
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className='outline-none w-full h-full'
                  type="number"
                />
                <h1 className='border-l px-1 border-gray-400'>%</h1>
              </div>
              <h1>- {(total * discount) / 100 || 0}</h1>
            </label>

            <label className='flex w-full justify-between items-center'>
              <input type="text" className='w-28 rounded-md h-full bg-white outline-none border border-dotted p-1 px-2 border-gray-400' disabled value={'adjustment'} />
              <div className='flex items-center p-1 px-2 rounded-md w-[7.5vw] border bg-white border-gray-400'>
                <input onChange={(e) => setAdjustment(e.target.value)} className='outline-none w-full h-full' type="text" value={adjustment} />
                <h1 className='border-l px-1 border-gray-300'>Rs.</h1>
              </div>
              <h1>- {adjustment || 0}</h1>
            </label>
            <hr className='border-gray-300' />

            <label className='flex justify-between'>
              <h1 className='font-bold text-lg'>Total ( Rs.)</h1>
              <h1 className='font-bold text-lg'>{(total - (total * discount || 0) / 100 - (adjustment || 0)).toLocaleString() || 0}</h1>
            </label>
          </div>
        </div>

        <div className="w-full mt-5 flex justify-end pr-36">
          <button type='submit' className="inline-block py-1 text-md text-white bg-blue-600 px-5 hover:bg-blue-900 rounded-xl font-semibold">
            Create
          </button>


        </div>

      </form>
    </div>
  );
};

export default Invoice;



