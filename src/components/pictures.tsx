import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedPicture, picturesSelector } from '../reducer';
import ModalPortal from './modal';
import { CloseModal, SelectPicture } from '../types/actions.type';

const Container = styled.div`
  padding: 1rem;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  margin: 10px;
  object-fit: contain;
  transition: transform 1s;
  max-width: fit-content;
  &:hover {
    transform: scale(1.2);
  }
`;

const Pictures = () => {
  const pictures = useSelector(picturesSelector);
  const selectedPicture = useSelector(getSelectedPicture);
  const dispatch = useDispatch();

  console.log('Pictures:', pictures); // Ajoutez ce log pour débuguer

  const handleSelectPicture = (picture: any) => {
    dispatch<SelectPicture>({ type: 'SELECT_PICTURE', picture });
  };

  const handleCloseModal = () => {
    dispatch<CloseModal>({ type: 'CLOSE_MODAL' });
  };

  // Vérification plus robuste
  if (!Array.isArray(pictures) || pictures.length === 0) {
    return <p>No pictures available</p>;
  }

  return (
    <Container>
      {pictures.map((picture, index) => (
        <Image
          key={index}
          src={picture.previewFormat}
          alt={`Cat ${index + 1}`}
          onClick={() => handleSelectPicture(picture)}
        />
      ))}
      {selectedPicture && selectedPicture._tag === 'Some' && selectedPicture.value && (
        <ModalPortal
          largeFormat={selectedPicture.value.largeFormat}
          close={handleCloseModal}
        />
      )}
    </Container>
  );
};

export default Pictures;