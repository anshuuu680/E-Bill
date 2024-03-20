import { Link } from 'react-router-dom'
import numWords from 'num-words';
import { useGlobalContext } from '../Context';
import html2pdf from 'html2pdf.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Pdf = () => {

  const { formData, setFormData } = useGlobalContext();
  const [userData, setUserData] = useState();
  const [pdfLoading, setPdfLoading] = useState(false);

  const {
    customer = 'NA',
    address = 'NA',
    city = 'NA',
    contact = 0,
    invoiceDate = 'NA',
    invoiceNumber = 'NA',
    paymentMode = 'NA',
    financeBy = 'NA',
    items = [],
    adjustment = 0,
    discount = 0,
    totalWithout = 0,
    totalAmount = 0,
    totalTaxableValue = 0,
    totalQuantity = 0,
    totalCgstAmount = 0,
    totalSgstAmount = 0
  } = formData || {};

  console.log(totalWithout)


  if (totalAmount) {
    Math.floor(totalAmount);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user-data');
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [setUserData]);
  
  
  
  const handleDownloadPDF = () => {
    if (!pdfLoading) {
      setPdfLoading(true);
      const capture = document.querySelector('.MyReceipt');
      const options = {
        filename: `${customer} receipt.pdf`,
        image: { type: 'jpeg', quality: 0.5 },
        html2canvas: { scale: 1 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, 
      };
      
      html2pdf().from(capture).set(options).save().then(() => setPdfLoading(false));
    }
  };
  

  const downloadPDF = () => {
    handleDownloadPDF((pdf) => {
      pdf.save(`${customer} receipt.pdf`);
    });
  };

  const printPDF = () => {
    handleDownloadPDF((pdf) => {
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    });
  };

  return (
    <div className="w-full h-fit  flex flex-col items-center p-2 pb-10">
      <div className="MyReceipt relative w-[800px] h-fit p-4 text-sm">
        <div className="flex w-fit h-screen absolute  justify-center items-center ">
          <h1 className='text-center leading-normal -rotate-[30deg] text-[60px] opacity-10 font-[Ravie] cursor-not-allowed'>
            {userData?.companyName}
          </h1>
        </div>
        <div className=" w-full min-h-fit  border border-black">
          <div className="w-full h-fit">
            <div className="w-full h-fit  flex justify-between items-center text-sm font-semibold p-2 px-4">
              <h1>Invoice No. :<span> {invoiceNumber || 'NA'}</span> </h1>
              <h1>TAX INVOICE</h1>
              <h1>Invoice Date : <span> {invoiceDate || 'NA'}</span> </h1>
            </div>
            <div className="w-full h-fit flex flex-col items-center  border-black">
              <div className="w-full h-fit p-2">
                <div className="w-full h-fit flex flex-col items-center p-2">
                  <h1 className="font-bold text-xl font-[Ravie]  text-orange-800">{userData?.companyName}</h1>
                  <span className="font-[Gilroy] text-sm">{userData?.slogan}</span>
                </div>

              </div>

              <div className="w-full h-fit mb-3 -mt-2 flex items-center justify-center flex-col">
                <div className="w-[400px] h-full flex items-center justify-center">
                  <a href={userData?.addressLink} className='text-center font-[Gilroy] tracking-wide leading-tight cursor-pointer'>
                    {userData?.address}
                  </a>

                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-fit  flex justify-between items-center px-4 border-y border-black py-2">

            <h1 className='font-bold text-orange-700'>GSTIN : <span className='text-red-800'>{userData?.gstin}</span></h1>
            <h1 className='font-bold text-orange-700'>Mob. : <span className='text-black'>+91 {userData?.contact}</span></h1>
          </div>
          <div className="w-full h-fit flex ">
            <div className="w-7/12 h-full  flex flex-col  items-center gap-2 ">

              <h1 className='font-semibold w-full flex justify-center '>Customer Details</h1>
              <div className="w-full h-fit flex flex-col  gap-1 p-2">
                <label className='flex w-2/3 justify-between'>
                  <h1>Customer Name :</h1>
                  <h1 className='font-semibold'>{customer || 'NA'}</h1>
                </label>
                <label className='flex w-2/3 justify-between'>
                  <h1>Address :</h1>
                  <h1 className='font-semibold'>{address || 'NA'}</h1>
                </label>
                <label className='flex w-2/3 justify-between'>
                  <h1>City :</h1>
                  <h1 className='font-semibold'>{city || 'NA'}</h1>
                </label>
                <label className='flex w-2/3 justify-between'>
                  <h1>Contact :</h1>
                  <h1 className='font-semibold'>+91 {contact || 'NA'}</h1>
                </label>
              </div>
            </div>

            <div className="w-5/12 h-full  flex flex-col items-center gap-2 ">
              <h1 className='font-semibold w-full flex justify-center'>Payment Details</h1>
              <div className="w-full h-fit flex flex-col gap-1  p-2">
                <label className='flex w-2/3 justify-end gap-2'>
                  <h1>Payment Mode :</h1>
                  <h1 className='font-semibold'>{paymentMode || 'Cash'}</h1>
                </label>

                {paymentMode == 'Upi' && <label className='flex-col w-full justify-between'>
                  <div className="w-full h-full flex flex-col items-center justify-center ">

                    <div className="w-48 h-36">
                      <img className='w-full h-full object-contain' src={userData?.QRcode} alt="" />
                    </div>
                    <h1 className='font-semibold'>Anshu Patidar</h1>
                  </div>
                </label>}

                {paymentMode == 'Finance' && <label className='flex w-2/3 justify-between'>
                  <h1>Finance By :</h1>
                  <h1 className='font-semibold'>{''}</h1>
                </label>}

                {paymentMode == 'Finance' && <label className='flex w-2/3 justify-between'>
                  <h1>Down Payment :</h1>
                  <h1 className='font-semibold'>{1999}</h1>
                </label>}

                {paymentMode == 'Finance' && <label className='flex w-2/3 justify-between'>
                  <h1>Loan Amount :</h1>
                  <h1 className='font-semibold'>{18000}</h1>
                </label>}

                {paymentMode == 'Finance' && <label className='flex w-2/3 justify-between'>
                  <h1>Loan Number :</h1>
                  <h1 className='font-semibold'>{18000}</h1>
                </label>}

              </div>



            </div>
          </div>
          <table className="w-full mt-1">
            <thead>
              <tr>
                <th className="border border-gray-400 border-l-0  py-2 text-sm font-semibold w-[24px] text-centre px-2">Product Name</th>
                <th className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20">Qty.</th>
                <th className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20">Rate</th>
                <th className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20">Taxable value</th>
                <th className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20">CGST (%)</th>
                <th className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20">CGST Amount</th>
                <th className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20">SGST (%)</th>
                <th className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20">SGST Amount</th>
                <th className="border border-gray-400 border-r-0  text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 border-l-0 text-center">
                    <h1 className="w-64 rounded-md px-2 py-2 focus:outline-none focus:border focus:border-blue-500  text-sm font-semibold"
                    >{item.productName || 'NA'}</h1>


                  </td>
                  <td className="border border-gray-400 text-center">
                    <h1 className="w-fit rounded-md px-2  focus:outline-none focus:border focus:border-blue-500  text-sm"
                    >{item.quantity || 'NA'}</h1>
                  </td>
                  <td className="border border-gray-400 text-center">
                    <h1 className="w-fit rounded-md px-2 focus:outline-none focus:border focus:border-blue-500  text-sm"
                    >{item.price || 'NA'}</h1>
                  </td>
                  <td className="border border-gray-400 text-center">
                    <h1 className="w-fit rounded-md px-2 focus:outline-none focus:border focus:border-blue-500  text-sm"
                    >{(item.price * item.quantity) - (item.price * item.quantity) * (Number(item.cgst) + Number(item.sgst)) / 100 || 'NA'}</h1>
                  </td>
                  <td className="border border-gray-400 text-center">
                    <h1 className="w-fit rounded-md px-2 focus:outline-none focus:border focus:border-blue-500  text-sm"
                    >{item.cgst || 0}</h1>
                  </td>
                  <td className="border border-gray-400 text-center">
                    <h1 className="w-fit rounded-md px-2 focus:outline-none focus:border focus:border-blue-500  text-sm"
                    >{(item.price * item.quantity) * item.cgst / 100}</h1>
                  </td>
                  <td className="border border-gray-400 text-center">
                    <h1 className="w-fit rounded-md px-2 focus:outline-none focus:border focus:border-blue-500  text-sm"
                    >{item.sgst || 0}</h1>
                  </td>
                  <td className="border border-gray-400 text-center">
                    <h1 className="w-fit rounded-md px-2 focus:outline-none focus:border focus:border-blue-500  text-sm"
                    >{(item.price * item.quantity) * item.sgst / 100}</h1>
                  </td>
                  <td className="border border-gray-400 border-r-0 text-center">
                    <h1 className="w-fit rounded-md px-2 focus:outline-none focus:border focus:border-blue-500  text-sm font-semibold"
                    >{item.price * item.quantity}</h1>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="border border-gray-400 border-l-0 py-2 text-sm font-semibold px-2 w-20"></td>
                <td className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20 text-center">{totalQuantity} Nos.</td>
                <td className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20"></td>
                <td className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20 text-center">{totalTaxableValue || 0}</td>
                <td className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20"></td>
                <td className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20 text-center">{totalCgstAmount || 0}</td>
                <td className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20"></td>
                <td className="border border-gray-400 py-2 text-sm font-semibold px-2 w-20 text-center">{totalSgstAmount}</td>
                <td className="border border-gray-400 border-r-0 py-2 text-sm font-semibold px-2 w-20 text-center">{totalWithout}</td>
              </tr>
            </tfoot>
          </table>

          <div className="w-full h-[80px] flex justify-end border-4 p-4">
            <div className="w-1/3 h-full   font-semibold flex flex-col items-center justify-center gap-1">
              <h1 className='flex items-center'>Discount :     <span className='font-bold'>&nbsp;&nbsp;{discount || 0}% / Rs. {(totalWithout * discount) / 100 || 0} </span> </h1>
              <h1 className='flex items-center'>Adjustment :     <span className='font-bold'>&nbsp;&nbsp;Rs. {adjustment || 0}</span> </h1>

              <h1 className='flex items-center'>Total :     <span className='font-bold'>&nbsp;&nbsp;Rs. {(totalWithout - ((totalWithout * discount) / 100) - adjustment)}</span> </h1>
            </div>
          </div>

          <div className="w-full h-[30px]  border-y border-black flex text-sm p-2">
            <div className="w-2/3 h-full flex items-center justify-center border-r border-black">
              <h1 className='font-semibold text-xs'>RS. <span> {numWords(Math.floor((totalWithout - (totalWithout * discount) / 100) - adjustment)).toUpperCase()}</span> ONLY</h1>

            </div>
            <div className="w-1/3 h-full  flex justify-center items-center">
              <h1 className='font-semibold'>Invoice Value : </h1>
              <h1 className='font-bold'>&nbsp; {(totalWithout - (totalWithout * discount) / 100) - adjustment}</h1>
            </div>
          </div>

          <div className="w-full h-[70px]  flex justify-around p-2">
            <div className="w-1/3 h-full  flex justify-center items-end">
              <h1 className='font-semibold'>Delivery Charges Extra</h1>

            </div>
            <div className="w-[450px] h-full flex">
              <div className="w-1/2 h-full  flex justify-center items-end">
                <h1 className='text-sm font-semibold'>Customer's Signature</h1>
              </div>
              <div className="w-1/2 h-full flex flex-col justify-end items-center">

                <h1 className='text-sm font-semibold'>Authorized Signatory</h1>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="w-2/3 flex gap-4 justify-end ">
        <button
          className="inline-block py-2 text-md text-white bg-green-600 px-5 hover:bg-green-900 rounded-xl font-semibold"
        >
          Send to customer

        </button>
        <button
          onClick={printPDF}
          className="inline-block py-2 text-md text-white bg-red-600 px-5 hover:bg-red-900 rounded-xl font-semibold"
        >
          Print

        </button>
        <button
          className="inline-block py-2 text-md text-white bg-blue-600 px-5 hover:bg-blue-900 rounded-xl font-semibold"
          onClick={downloadPDF}
        >
          Download

        </button>

      </div>



    </div>
  )
}
export default Pdf;