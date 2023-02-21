import React, { useEffect, useRef, useState } from 'react';

const AnimatedContent = ({
  content = '',
  interval = 20,
  showAllText = false,
  onDisplayStatusChange = (_displayStatus) => void 0,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const currentDisplay = useRef(displayedContent);
  currentDisplay.current = displayedContent;

  useEffect(() => {
    if (showAllText) {
      setShowAll(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAllText]);

  useEffect(() => {
    setDisplayedContent('');
    setShowAll(false);
  }, [content]);

  useEffect(() => {
    if (showAll) {
      setDisplayedContent(content);
    } else {
      if (content !== '') {
        const intervalId = handleInterval();
        return () => {
          clearInterval(intervalId);
        };
      } else {
        setShowAll(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAll]);

  useEffect(() => {
    onDisplayStatusChange(showAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAll]);

  const handleInterval = () => {
    const words = Array.from(content);
    return setInterval(() => {
      if (currentDisplay.current.length < words.length) {
        setDisplayedContent(
          currentDisplay.current + words[currentDisplay.current.length]
        );
      } else {
        setShowAll(true);
      }
    }, interval);
  };
  return <div>{displayedContent}</div>;
};

export default AnimatedContent;
