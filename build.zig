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
                .content_dir_path = "content",
            },
            .{
                .code = "ko-KR",
                .name = "Korean",
                .site_title = "brookjeynes.dev",
                .content_dir_path = "content",
            },
        },
    });

    // This line creates a build step that generates an updated
    // Scripty reference file. Other sites will not need this
    // most probably, but at least it's an example of how Zine
    // can integrate neatly with other Zig build steps.
    zine.scriptyReferenceDocs(b, "content/documentation/scripty/index.md");
}
