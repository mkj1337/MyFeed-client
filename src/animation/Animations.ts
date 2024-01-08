export const scaleVariants: any = {
    hidden: {
      scale: 0.8,
      opacity: 0.5,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.1,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };
  
  export const scale2Variants: any = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 80
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.1 },
    },
  };
  
  export const buttonVariants = {
    hover: {
      width: '100%',
      originX: 0,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.9,
    },
  };
  