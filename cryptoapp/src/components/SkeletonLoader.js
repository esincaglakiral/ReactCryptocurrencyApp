import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

const StyledSkeletonContainer = styled.div`
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const SkeletonLoader = ({ itemCount = 3 }) => {
  return (
    <StyledSkeletonContainer>
      <Skeleton height={100} width={200} />
      <Skeleton height={20} width={150} />
      {[...Array(itemCount)].map((_, index) => (
        <Skeleton key={index} height={15} width={'100%'} style={{ marginBottom: '10px' }} />
      ))}
    </StyledSkeletonContainer>
  );
};

export default SkeletonLoader;
