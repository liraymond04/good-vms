import { AnyPublication, PaginatedPublicationsResult, Post, PublicationsQuery } from '@good/lens';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Virtuoso } from 'react-virtuoso';
import { useState } from 'react';
import SinglePublication from '@components/Publication/SinglePublication';
import { useRouter } from 'next/router';
import { Tooltip } from '@good/ui';
  
interface RequestTableProps {
  publications: any;
}

const RequestTable: React.FC<RequestTableProps> = ({ publications }) => {

  // Potential filter function, for when we get the metadata working
  // const filterRequestPublications = () => {
  //   publicationsData?.publications.items?.filter((publication) => {
  //     return (publication.__typename == "Request")
  //   }) 
  // }
  const { pathname, push } = useRouter();
  
  return (
    <div id="request-table">
    <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead className="request-table-head">
        <tr>
          <th>Name</th>
          <th>Good Amount</th>
          <th>Donation Amount</th>
          <th>VHR Amount</th>
          <th>Hours</th>
          <th>YYYY-MM-DD</th>
          <th>Request Status</th>
        </tr>
      </thead>
      <tbody>
        {publications.map((publication: AnyPublication) => (
            <tr key={publication.id} className="request-table-row">
              {/* Replace the "false" below with the attribute that tells us 
                whether the user is a volunteer or organization.
                E.g. currentProfile?.metadata?.attributes?[index of volunteer/organization] */}
                
              <td className="request-data-linked" onClick={() => {
                const selection = window.getSelection();
                if (!selection || selection.toString().length === 0) {
                  push(`/posts/${publication?.id}`);
                }
              }}> <Tooltip content={<span>View original publication: "{(publication as Post).metadata.content}"</span>}>
                <div className="ld-text-gray-500 text-sm">{false ? "Sample Volunteer" : "Sample Org"}</div>
                </Tooltip></td>
              {/* <td>{false ? "publication.volunteerName" : "publication.organizationName"}</td> */}
              <td className="request-data-linked">
              <Tooltip content={<span>View transaction hash</span>}>
                <div className="ld-text-gray-500 text-sm">Good Amount placeholder</div>
                </Tooltip></td>
              <td className="ld-text-gray-500 text-sm">Donation placeholder</td>
              <td className="request-data-linked">
              <Tooltip content={<span>View transaction hash</span>}>
                <div className="ld-text-gray-500 text-sm">VHR Amount placeholder</div>
                </Tooltip></td>
              <td className="ld-text-gray-500 text-sm">Hours placeholder</td>
              {/* <td>{row.amount}</td>
              <td>{row.hours}</td> */}
              <td className="ld-text-gray-500 text-sm">{publication.createdAt.toLocaleString().split('T')[0]}</td>
              <td className="request-data-linked" onClick={() => {
                const selection = window.getSelection();
                if (!selection || selection.toString().length === 0) {
                  push(`/posts/${publication?.id}`);
                }
              }}><Tooltip content={<span>View original publication</span>}>
              <div className="ld-text-gray-500 text-sm">Request status placeholder</div>
              </Tooltip></td>
              <hr style={{ borderTop: "1px solid lightgrey" }}></hr>
            </tr>
        ))}
      </tbody>
    </table>

    
    </div>
  );
};

export default RequestTable;