import React from "react";

/**
 * MDX 内文链接。Tailwind preflight 会把 <a> 重置为继承正文颜色、
 * 无下划线（链接"隐形"），这里恢复链接外观；外链自动新窗口打开。
 */
export function MdxLink({
  href = "",
  children,
  ...props
}: React.HTMLProps<HTMLAnchorElement>) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
      className="text-primary font-medium underline decoration-primary/40 hover:decoration-primary underline-offset-2 transition-colors"
    >
      {children}
    </a>
  );
}
