
import React, { FC } from 'react';
import { HiOutlineCurrencyDollar } from "react-icons/hi2";

interface DollarIconProps {
  className?: string;
}

export const DollarIcon: FC<DollarIconProps> = ({ className }) => {

  return (
    <HiOutlineCurrencyDollar></HiOutlineCurrencyDollar>
  );
};
