import dayjs from 'dayjs';
import { parseChatBody, decodeHtmlEntities } from '../../../utils/htmlUtils';
import ScrollArea from '../../../components/common/ScrollArea';

const HTML_TAG_RE = /<[a-zA-Z][^>]*>/;

function formatBody(decoded) {
  if (!decoded) return '';
  // If content already has HTML tags, render as-is
  if (HTML_TAG_RE.test(decoded)) return decoded;
  // Plain text — convert newlines to <br> so line breaks show up
  return decoded.replace(/\r\n/g, '\n').replace(/\n/g, '<br>');
}

function ChatBubble({ msg, isOutgoing }) {
  const body = parseChatBody(msg.chat_body);
  const decoded = decodeHtmlEntities(body);
  const html = formatBody(decoded);
  const time = msg.created_at ? dayjs(msg.created_at).format('MMM D, YYYY hh:mm A') : '';

  return (
    <div className={`flex flex-col gap-[2px] ${isOutgoing ? 'items-end' : 'items-start'}`}>
      <div className="text-[10px] text-[#94a3b8] font-medium">{msg.created_by || 'System'}</div>
      <div
        className={`px-[13px] py-[8px] text-[12px] leading-[1.5] max-w-[78%] ${
          isOutgoing
            ? 'bg-blue-600 text-white rounded-[14px_14px_3px_14px]'
            : 'bg-[#f8fafc] text-[#0f172a] border border-[#e8ecf1] rounded-[14px_14px_14px_3px]'
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="text-[10px] text-[#94a3b8]">{time}</div>
    </div>
  );
}

export default function ChatThread({ chats, currentUser }) {
  const header = (
    <div className="px-[14px] py-[9px] text-[10px] font-bold uppercase tracking-[0.7px] text-[#475569] bg-[#f8fafc] border-b border-[#e8ecf1] rounded-t-[10px] flex items-center gap-[6px]">
      <i className="ti ti-message text-[13px]" />
      Chat Thread
    </div>
  );

  if (!chats || chats.length === 0) {
    return (
      <div className="bg-white border border-[#e8ecf1] rounded-[10px] flex flex-col h-full">
        {header}
        <div className="flex-1 flex items-center justify-center text-[12px] text-[#94a3b8] gap-[6px]">
          <i className="ti ti-message text-[14px]" />
          No messages yet for this ticket.
        </div>
      </div>
    );
  }

  const currentUserName = currentUser?.name || '';

  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[10px] flex flex-col h-full overflow-hidden">
      {header}
      <ScrollArea className="p-[14px] flex flex-col gap-[10px] flex-1">
        {chats.map(msg => (
          <ChatBubble
            key={msg.chat_id}
            msg={msg}
            isOutgoing={!!currentUserName && msg.created_by === currentUserName}
          />
        ))}
      </ScrollArea>
    </div>
  );
}
