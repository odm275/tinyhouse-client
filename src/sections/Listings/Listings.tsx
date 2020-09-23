import React from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo";
import List from "antd/es/list";
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import "./styles/Listings.css";
const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };
  const listings = data ? data.listings : null;
  const listingsList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item>
          <List.Item.Meta title={listing.title} />
        </List.Item>
      )}
    />
  ) : null;
  if (loading) {
    return <h2>Loading ...</h2>;
  }
  if (error) {
    return <h2>Something went wrong -- Please try again later!</h2>;
  }

  const deleteListingLoadingMessage = deleteListingLoading ? (
    <h4>Deleteion in progress ....</h4>
  ) : null;

  const deleteListingErrorMessage = deleteListingError ? (
    <h4>
      Uh ho! Something went wrong with deleting - please try again later:(
    </h4>
  ) : null;

  return (
    <div className="listings">
      <h2>{title}</h2>
      {listingsList}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  );
};
