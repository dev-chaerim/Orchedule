"use client";

import React from "react";
import Linkify from "linkify-react";

// 유튜브 URL 판별
function isYoutubeUrl(url: string) {
  return /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)/.test(
    url
  );
}

// 유튜브 임베드 URL로 변환
function convertYoutubeUrlToEmbed(url: string) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
}

interface LinkifiedContentProps {
  text: string;
}

// ✅ 커스텀 인터페이스 선언 (class 속성 포함)
interface CustomLinkAttributes
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  class?: string;
}

export default function LinkifiedContent({ text }: LinkifiedContentProps) {
  const linkifyOptions = {
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-blue-600 hover:underline break-words", // 고정 스타일
    render: ({
      attributes,
      content,
    }: {
      attributes: CustomLinkAttributes;
      content: string;
    }) => {
      const url = attributes.href ?? "";
      const { class: classAttr, ...rest } = attributes;

      if (isYoutubeUrl(url)) {
        return (
          <div className="my-4">
            <div className="aspect-w-16 aspect-h-9 mb-1">
              <iframe
                src={convertYoutubeUrlToEmbed(url)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="text-xs text-gray-500 break-all mt-1">
              <span className="mr-1 text-gray-400">원본 링크:</span>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </div>
          </div>
        );
      }

      // 기본 링크
      return (
        <a {...rest} className={classAttr}>
          {content}
        </a>
      );
    },
  };

  return (
    <Linkify options={linkifyOptions}>
      <div className="whitespace-pre-line text-sm text-gray-700 pb-7">
        {text || "내용이 없습니다."}
      </div>
    </Linkify>
  );
}
