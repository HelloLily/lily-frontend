import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SocialMediaIcon = ({ item }) => {
  const iconMap = {
    twitter: ['fab', 'twitter'],
    linkedin: ['fab', 'linkedin'],
    facebook: ['fab', 'facebook'],
    other: 'share-alt'
  };

  return <FontAwesomeIcon icon={iconMap[item.name]} fixedWidth />
};

export default React.memo(SocialMediaIcon);
