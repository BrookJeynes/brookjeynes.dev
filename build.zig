const std = @import("std");
const zine = @import("zine");

pub fn build(b: *std.Build) !void {
    zine.multilingualWebsite(b, .{
        .host_url = "https://brookjeynes.dev",
        .layouts_dir_path = "layouts",
        .assets_dir_path = "assets",
        .static_assets = &.{
            "brook-jeynes-cv.pdf",
            "CNAME",
        },
        .i18n_dir_path = "i18n",
        .locales = &.{
            .{
                .code = "en-US",
                .name = "English",
                .output_prefix_override = "",
                .site_title = "brookjeynes.dev",
                .content_dir_path = "content/en-US",
            },
            .{
                .code = "ko-KR",
                .name = "Korean",
                .site_title = "brookjeynes.dev",
                .content_dir_path = "content/ko-KR",
            },
        },
    });
}
